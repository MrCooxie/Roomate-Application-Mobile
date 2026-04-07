from flask import Blueprint, jsonify, request, current_app

users_bp = Blueprint('users', __name__)


def _get_interest_map():
    """Build a map of interest record ID -> {label, icon} from Airtable."""
    records = current_app.airtable.get_interests()
    if not records:
        return {}
    interest_map = {}
    for r in records:
        fields = r.get("fields", {})
        icon_url = None
        icons = fields.get("icon", [])
        if icons and len(icons) > 0:
            icon_url = icons[0].get("url")
        interest_map[r["id"]] = {
            "label": fields.get("label", ""),
            "icon": icon_url,
        }
    return interest_map


def _jaccard(set_a, set_b):
    """Jaccard similarity between two sets, returns 0.0–1.0."""
    if not set_a and not set_b:
        return 0.0
    a, b = set(set_a), set(set_b)
    union = a | b
    if not union:
        return 0.0
    return len(a & b) / len(union)


def _calculate_compatibility(fields, current_user):
    """Weighted multi-factor compatibility score (0–100).

    Factors:
      - Interests overlap (Jaccard):            50%
      - Apartment preferences overlap (Jaccard): 30%
      - Same city:                               10%
      - Same school:                             10%
    """
    if not current_user:
        return 0

    # Interests — Jaccard on linked record IDs
    interest_score = _jaccard(
        fields.get("userInterests", []),
        current_user.get("userInterests", []),
    )

    # Apartment preferences — Jaccard on linked record IDs
    apt_score = _jaccard(
        fields.get("userApartmentPreferences", []),
        current_user.get("userApartmentPreferences", []),
    )

    # Same city bonus
    city_score = 0.0
    their_city = (fields.get("city") or "").strip().lower()
    my_city = (current_user.get("city") or "").strip().lower()
    if their_city and my_city and their_city == my_city:
        city_score = 1.0

    # Same school bonus
    school_score = 0.0
    their_school = (fields.get("school") or "").strip().lower()
    my_school = (current_user.get("school") or "").strip().lower()
    if their_school and my_school and their_school == my_school:
        school_score = 1.0

    total = (
        interest_score * 50
        + apt_score * 30
        + city_score * 10
        + school_score * 10
    )
    return round(total)


def _transform_roommate(record, interest_map, current_user_fields):
    """Transform an Airtable Users record into the frontend Roommate shape."""
    fields = record.get("fields", {})

    # Profile picture URL
    image = None
    pics = fields.get("profile picture", [])
    if pics:
        image = pics[0].get("url")

    # Resolve interests
    interest_ids = fields.get("userInterests", [])
    interests = []
    for interest_id in interest_ids:
        interest = interest_map.get(interest_id)
        if interest:
            interests.append(interest)

    compatibility = _calculate_compatibility(fields, current_user_fields)

    return {
        "id": fields.get("id", record["id"]),
        "name": f"{fields.get('firstName', '')} {fields.get('lastName', '')}".strip(),
        "firstName": fields.get("firstName", ""),
        "age": fields.get("age", 0),
        "compatibility": compatibility,
        "city": fields.get("city", ""),
        "university": fields.get("school", ""),
        "image": image,
        "interests": interests,
    }


def _transform_apartment(record):
    """Transform an Airtable Housing record into the frontend Apartment shape."""
    fields = record.get("fields", {})

    # Image URL
    image = None
    images = fields.get("image", [])
    if images:
        image = images[0].get("url")

    # Owner avatar
    owner_avatar = None
    owner_pics = fields.get("Profile Picture (from Owners)", [])
    if owner_pics:
        owner_avatar = owner_pics[0].get("url")

    return {
        "id": fields.get("id", record["id"]),
        "address": fields.get("address", ""),
        "priceLabel": fields.get("priceLabel", ""),
        "priceValue": fields.get("priceValue", ""),
        "maxTenants": fields.get("maxTenants", 0),
        "sqft": fields.get("sqft", 0),
        "beds": fields.get("beds", 0),
        "baths": fields.get("baths", 0),
        "description": fields.get("description", ""),
        "image": image,
        "ownerAvatar": owner_avatar,
        "mapImage": fields.get("mapImage"),
    }


@users_bp.route('/roommates', methods=["POST", "GET"])
def get_users():
    # Get user_id from query param (GET) or POST body
    user_id = None
    if request.method == "POST":
        body = request.get_json(silent=True) or {}
        user_id = body.get("user_id")
    else:
        user_id = request.args.get("user_id")

    records = current_app.airtable.get_users()
    if records is None:
        return jsonify({"error": "Failed to fetch roommates"}), 500

    # Fetch current user's full fields for multi-factor compatibility
    current_user_fields = None
    if user_id:
        user_record = current_app.airtable.get_table_records("Users", user_id)
        if user_record:
            current_user_fields = user_record.get("fields", {})

    interest_map = _get_interest_map()
    roommates = []
    for r in records:
        # Skip the requesting user
        if user_id and r["id"] == user_id:
            continue
        roommates.append(_transform_roommate(r, interest_map, current_user_fields))

    # Sort by compatibility descending so best matches appear first
    roommates.sort(key=lambda x: x["compatibility"], reverse=True)
    return jsonify(roommates), 200


@users_bp.route('/apartments', methods=['GET'])
def get_housing():
    records = current_app.airtable.get_housing()
    if records is None:
        return jsonify({"error": "Failed to fetch apartments"}), 500

    apartments = [_transform_apartment(r) for r in records]
    return jsonify(apartments), 200


@users_bp.route('/profile/<record_id>', methods=['GET'])
def get_profile(record_id):
    record = current_app.airtable.get_table_records("Users", record_id)
    if not record:
        return jsonify({"error": "User not found"}), 404

    fields = record.get("fields", {})
    interest_map = _get_interest_map()

    image = None
    pics = fields.get("profile picture", [])
    if pics:
        image = pics[0].get("url")

    interests = []
    for interest_id in fields.get("userInterests", []):
        interest = interest_map.get(interest_id)
        if interest:
            interests.append(interest)

    return jsonify({
        "name": f"{fields.get('firstName', '')} {fields.get('lastName', '')}".strip(),
        "firstName": fields.get("firstName", ""),
        "lastName": fields.get("lastName", ""),
        "age": fields.get("age", 0),
        "city": fields.get("city", ""),
        "university": fields.get("school", ""),
        "email": fields.get("email", ""),
        "image": image,
        "interests": interests,
    }), 200
