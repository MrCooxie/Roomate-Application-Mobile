from flask import Blueprint, jsonify, current_app

users_bp = Blueprint('users', __name__)

@users_bp.route('/roommates', methods=['GET'])
def get_users():
    # Demonstrating how to use the service attached to the app object
    records = current_app.airtable.get_users()
    if records:
        return jsonify(records), 200
    return jsonify({"error": "Failed to fetch users"}), 500

@users_bp.route('/apartments', methods=['GET'])
def get_housing():
    records = current_app.airtable.get_housing()
    if records:
        return jsonify(records), 200
    return jsonify({"error": "Failed to fetch housing"}), 500
