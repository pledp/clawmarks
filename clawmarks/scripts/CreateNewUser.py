from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import sqlite3

app = Flask(__name__)
cors = CORS(app)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"
print(db_path)

@app.route('/CreateNewUser')
def CreateNewUser():
    try:
        conn = sqlite3.connect(db_path)
        username = request.args.get('username')
        high_score = request.args.get('high_score')

        cur = conn.cursor()
        cur.execute(f"INSERT INTO game (id, high_score, screen_name) VALUES ((SELECT COUNT(*) FROM game)+1, ?, ?)",(high_score, username))

        return jsonify({'success': True})

    except sqlite3.Error as error:
        print("Database error ", error)
        return jsonify({'success': False, 'error': str(error)})


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
