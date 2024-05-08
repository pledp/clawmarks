from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import sqlite3

app = Flask(__name__)
cors = CORS(app)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"
print(db_path)

@app.route('/UsernameExists/<username>')
def UsernameExists(username):
    conn = sqlite3.connect(db_path)

    cursor = conn.cursor()
    cursor.execute(f"SELECT 1 FROM game WHERE screen_name = '{username}'")
    rows = cursor.fetchall()

    exists = bool(rows)
    return jsonify({'exists': exists})

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=10000)
