from flask import Blueprint
from flask_cors import CORS, cross_origin

import os
import sqlite3

airport_blueprint = Blueprint("RandomAirport", __name__)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"


@airport_blueprint.route('/RandomAirport')
@cross_origin()
def RandomAirport():
    conn = sqlite3.connect(db_path);

    cur = conn.cursor();
    cur.execute(f'SELECT ident,  latitude_deg, longitude_deg FROM airport WHERE type = "large_airport" ORDER BY RANDOM() LIMIT 1')
    rows = cur.fetchall()

    conn.close();

    if rows:
        response = {
            "icao": rows[0][0],
            "lat": rows[0][1],
            "lon": rows[0][2],
        }

        return response;
    return False