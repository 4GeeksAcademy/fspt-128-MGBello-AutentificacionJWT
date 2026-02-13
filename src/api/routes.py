"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, select, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register():
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
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"Msg": "Register successfully"})


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get('email') or not data.get("password"):
        return jsonify({"Error": "All fields are required"}), 409

    user = db.session.execute(select(User).where(
        User.email == data.get('email'))).scalar_one_or_none()
    if not user:
        return jsonify({"Error": "Email or password not found"}), 404
    if user.check_hash(data.get("password")):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"msg": "Login successfully", "token": access_token}), 201

    else:
        return jsonify({"Error": "Email or password not found"}), 404
