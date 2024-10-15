from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearnex import patch_sklearn
from routes.item_routes import item_blueprint
from routes.auth_route import auth_bp
from routes.weather_forecast_api import weather_bp
from routes.air_quality import airquality_bp
from routes.request_orders import request_orders
from model.model_1.backened_1 import backened_1
from model.model_2.backened_2 import backened_2
from model.model_3.backened_3 import backened_3
from model.model_4.backened_4 import backened_4
from model.model_5.backened5 import backened5
from model.model_6.kisanvani import kisanvani
from routes.chats import chats
from flask_pymongo import PyMongo
from flask_socketio import  emit, join_room
from dotenv import load_dotenv
from  config import Config
from socketio_instance import socketio
patch_sklearn()

#Flask app STARTS here
app = Flask(__name__)

socketio.init_app(app)

app.config["MONGO_URI"] = Config.MONGO_URI
mongo = PyMongo(app)
from routes import product_routes

# Calling routes(blueprint)

#Registering the products route blueprint 
app.register_blueprint(product_routes.products)

#Registering the item_blueprint route blueprint 
app.register_blueprint(item_blueprint)

#Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

#Register the weather blueprint
app.register_blueprint(weather_bp)

#Register the air quality  blueprint
app.register_blueprint(airquality_bp)

#Register the request_orders  blueprint
app.register_blueprint(request_orders)

#Register the kisanvani  blueprint
app.register_blueprint(kisanvani)

#Register the chats  blueprint
app.register_blueprint(chats)

#Register the backened_1  blueprint
app.register_blueprint(backened_1)

#Register the backened_2  blueprint
app.register_blueprint(backened_2)

#Register the backened_3  blueprint
app.register_blueprint(backened_3)

#Register the backened_4  blueprint
app.register_blueprint(backened_4)

#Register the backened5  blueprint
app.register_blueprint(backened5)


print(f"scikit-learn version: {sklearn.__version__}")

if __name__ == '__main__':
    print("Starting Flask server...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
