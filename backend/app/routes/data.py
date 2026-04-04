from flask import Blueprint, jsonify, current_app

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


def _transform_roommate(record, interest_map, user_id):
    """Transform an Airtable Users record into the frontend Roommate shape."""
    fields = record.get("fields", {})

    # Profile picture URL
    image = None
    pics = fields.get("profile picture", [])
    if pics:
        image = pics[0].get("url")

    # Resolve interests
    interests = []
    for interest_id in fields.get("userInterests", []):
        interest = interest_map.get(interest_id)
        if interest:
            interests.append(interest)

    return {
        "id": fields.get("id", record["id"]),
        "name": f"{fields.get('firstName', '')} {fields.get('lastName', '')}".strip(),
        "firstName": fields.get("firstName", ""),
        "age": fields.get("age", 0),
        "compatibility": current_app.airtable.get_user(record["id"], user=user_id)["fields"]["compatibility"],
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
def get_users(user_id):
    records = current_app.airtable.get_users()
    if records is None:
        return jsonify({"error": "Failed to fetch roommates"}), 500

    interest_map = _get_interest_map()
    roommates = [_transform_roommate(r, interest_map, user_id) for r in records]
    return jsonify(roommates), 200


@users_bp.route('/apartments', methods=['GET'])
def get_housing():
    records = current_app.airtable.get_housing()
    if records is None:
        return jsonify({"error": "Failed to fetch apartments"}), 500

    apartments = [_transform_apartment(r) for r in records]
    return jsonify(apartments), 200
