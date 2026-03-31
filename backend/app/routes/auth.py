from flask import Blueprint, request, jsonify, current_app

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    # To access JSON data from the request body:
    data = request.get_json()
    
    # You can then access specific fields like this:
    email = data.get('email')
    password = data.get('password')
    
    # Basic validation example
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Use the injected AuthService
    # user = current_app.auth.authenticate_user(username, password) # TODO: Implement authentication
    
    return jsonify({
        "message": "Login successful!",
        "email": email,
        "password": password
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    age = data.get('age', '')
    school = data.get('school', '')
    city = data.get('city', '')
    introduction = data.get('introduction', '')
    interests = data.get('interests', [])
    apartment_preferences = data.get('apartmentPreferences', [])

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Split name into first/last
    name_parts = name.strip().split(' ', 1)
    first_name = name_parts[0] if name_parts else ''
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    # Build Airtable user record — only include fields that exist in the Users table
    user_data = {
        "email": email,
        "username": email,
        "firstName": first_name,
        "lastName": last_name,
        "age": int(age) if age else 0,
        "school": school,
        "city": city,
        "interests": interests,
    }

    result = current_app.airtable.create_user_records(user_data)

    if not result:
        return jsonify({"error": "Failed to create user"}), 500

    return jsonify({
        "message": "Registration successful",
        "id": result.get("id"),
    }), 201
