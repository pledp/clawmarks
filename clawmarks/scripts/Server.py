from flask import Flask, request
from flask_cors import CORS, cross_origin

from GetRandomAirport import airport_blueprint
from CreateNewUser import new_user_blueprint
from SaveUserChanges import save_user_blueprint
from UsernameExists import user_exists_blueprint


import os

app = Flask(__name__)
cors = CORS(app)

# Register all server things
app.register_blueprint(airport_blueprint)
app.register_blueprint(new_user_blueprint)
app.register_blueprint(save_user_blueprint)
app.register_blueprint(user_exists_blueprint)


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)