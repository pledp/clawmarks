from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = 'kayttajat.db'

def check_username_exists(username):
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("SELECT 1 FROM kayttajat WHERE kayttajatunnus = ?", (username,))
    user_exists = cursor.fetchone() is not None
    connection.close()
    return user_exists

@app.route('/tarkista_kayttaja/<kayttajatunnus>')
def tarkista_kayttaja(kayttajatunnus):
    kayttaja_olemassa = check_username_exists(kayttajatunnus)
    return jsonify({'kayttaja_olemassa': kayttaja_olemassa})

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
