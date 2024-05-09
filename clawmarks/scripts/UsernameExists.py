from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin

import os
import sqlite3

user_exists_blueprint = Blueprint("UsernameExists", __name__)


db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"
print(db_path)

@user_exists_blueprint.route('/UsernameExists/<username>')
@cross_origin()
def UsernameExists(username):
    conn = sqlite3.connect(db_path)

    cursor = conn.cursor()
    cursor.execute(f"SELECT 1 FROM game WHERE screen_name = '{username}'")
    rows = cursor.fetchall()
    
    exists = bool(rows)
    return jsonify({'exists': exists})
