from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin

import os
import sqlite3

get_user_blueprint = Blueprint("get_user_blueprint", __name__)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"
print(db_path)

@get_user_blueprint.route('/GetUser/<username>')
@cross_origin()
def GetUser(username):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        cur.execute(f"SELECT screen_name, high_score FROM game WHERE screen_name = '{username}'")
        rows = cur.fetchall()

        if rows:
            return jsonify({
                'username': rows[0][0],
                'high_score': rows[0][1],
                });

        else:
            return jsonify({
                'success': False,
            })

    except sqlite3.Error as error:
        print("Database error ", error)
        return jsonify({'success': False, 'error': str(error)})
