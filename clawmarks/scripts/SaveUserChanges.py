from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin

import os
import sqlite3

save_user_blueprint = Blueprint("save_user_blueprint", __name__)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"
print(db_path)

@save_user_blueprint.route('/SaveUserChanges/<username>/<high_score>')
@cross_origin()
def SaveUserChanges(username, high_score):
    try:
        conn = sqlite3.connect(db_path)

        cur = conn.cursor()
        cur.execute(f"UPDATE game SET high_score = {high_score} WHERE screen_name = '{username}'",)

        conn.commit()
        conn.close()

        return jsonify({'success': True})

    except sqlite3.Error as error:
        print("Database error ", error)
        return jsonify({'success': False, 'error': str(error)})
