from flask import Blueprint
from flask_cors import CORS, cross_origin

import os
import sqlite3

airport_blueprint = Blueprint("RandomAirport", __name__)

db_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/assets/flight_game.db"


@airport_blueprint.route('/RandomAirport/<n>')
@cross_origin()
def RandomAirport(n):
    conn = sqlite3.connect(db_path);

    cur = conn.cursor();
    cur.execute(f'SELECT ident,  latitude_deg, longitude_deg FROM airport WHERE type = "large_airport" ORDER BY RANDOM() LIMIT {n}')
    rows = cur.fetchall()

    airports = [{
        "icao": row[0],
        "lat": row[1],
        "lon": row[2],
    } for row in rows]


    conn.close();

    if rows:
        response = [{
            "icao": row[0],
            "lat": row[1],
            "lon": row[2],
        } for row in rows]
        return response;
    return False