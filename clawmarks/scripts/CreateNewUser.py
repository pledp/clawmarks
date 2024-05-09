from flask import Blueprint, jsonify
from flask_cors import CORS, cross_origin

import os
import sqlite3

new_user_blueprint = Blueprint("CreateNewUser", __name__)


db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"

@new_user_blueprint.route('/CreateNewUser/<username>')
@cross_origin()
def CreateNewUser(username):
    try:
        conn = sqlite3.connect(db_path)

        cur = conn.cursor()
        cur.execute(f"INSERT INTO game (id, high_score, screen_name) VALUES ((SELECT COUNT(*) FROM game)+1, 0, '{username}')")

        conn.commit()
        conn.close()

        return jsonify({'success': True})

    except sqlite3.Error as error:
        print("Database error ", error)
        return jsonify({'success': False, 'error': str(error)})