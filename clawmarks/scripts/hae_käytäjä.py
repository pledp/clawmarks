from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)


DATABASE = 'kayttajat.db'

def hae_kayttajan_tiedot(kayttajatunnus):
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM kayttajat WHERE kayttajatunnus = ?", (kayttajatunnus,))
    kayttaja = cursor.fetchone()
    connection.close()
    return kayttaja

@app.route('/kayttaja/<kayttajatunnus>')
def hae_kayttaja(kayttajatunnus):
    kayttaja = hae_kayttajan_tiedot(kayttajatunnus)
    if kayttaja:
        kayttaja_tiedot = {
            'kayttajatunnus': kayttaja[0],
            'nimi': kayttaja[1],
            'sahkoposti': kayttaja[2]
            
        }
        return jsonify(kayttaja_tiedot)
    else:
        return jsonify({'virhe': 'Käyttäjää ei löytynyt'}), 404

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
