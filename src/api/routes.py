"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, select, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get('email') or not data.get('password'):
        return jsonify({"Error": "Invalid data"}), 422

    user_exist = db.session.execute(select(User).where(
        User.email == data.get("email"))).scalar_one_or_none()
    if user_exist:
        return jsonify({"Error": "Already exist"}), 409

    new_user = User(
        email=data.get("email")
    )
    new_user.generate_hash(data.get("password"))
    db.session.commit()

    return jsonify({"Msg": "Register successfully"})
