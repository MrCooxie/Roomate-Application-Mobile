from flask import Blueprint, request, jsonify, current_app

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = current_app.auth.authenticate_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful!",
        "airtable_id": user["airtable_id"],
        "user_id": user["user_id"],
        "email": user["email"],
        "firstName": user["firstName"],
        "lastName": user["lastName"],
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    age = data.get('age', '')
    school = data.get('school', '')
    city = data.get('city', '')
    introduction = data.get('introduction', '')
    interests = data.get('interests', [])
    apartment_preferences = data.get('apartmentPreferences', [])

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user_data = {
        "email": email,
        "username": email,
        "password": password,
        "firstName": first_name,
        "lastName": last_name,
        "age": int(age) if age else 0,
        "school": school,
        "city": city,
        "interests": interests,
        "apartmentPreferences": apartment_preferences,
    }

    result = current_app.airtable.create_user_records(user_data)

    if not result:
        return jsonify({"error": "Failed to create user"}), 500

    fields = result.get("fields", {})
    return jsonify({
        "message": "Registration successful",
        "airtable_id": result.get("id"),
        "user_id": fields.get("id"),
        "email": fields.get("email", email),
        "firstName": fields.get("firstName", first_name),
        "lastName": fields.get("lastName", last_name),
    }), 201
