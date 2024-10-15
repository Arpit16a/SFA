from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
import pickle
import torch
import logging
from model.model_4.crop_model import predict_crop
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import traceback
from sklearn.ensemble import RandomForestClassifier
import sklearn
from sklearnex import patch_sklearn

backened_1= Blueprint('backened_1', __name__)

# Define model paths
MODEL_1_PATH_CROP_PREDICTION_MODEL_INTEL = os.path.join('model', 'model_1','crop_prediction_model_intel.joblib' )
MODEL_1_PATH_SCALER_INTEL = os.path.join('model', 'model_1','scaler_intel.joblib' )

# Load the model and encoders
model1 = joblib.load(MODEL_1_PATH_CROP_PREDICTION_MODEL_INTEL)
scaler1 = joblib.load(MODEL_1_PATH_SCALER_INTEL)

@backened_1.route('/')
def index():
    return jsonify({
        "status": "success",
        "message": "Server is running",
        "info": "Crop Prediction System using Intel oneDAL"
    })

#-------model_1------------------------------Specific Crop Recommendation-------

@backened_1.route('/predict', methods=['POST'])
def predict1():
    print("Received prediction request")
    try:
        data = request.json
        print("Received data:", data)  # Debug
        features = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
        input_data = np.array([[float(data[feature]) for feature in features]])
        
        # Scaling using the Intel oneDAL scaler
        input_data_scaled = scaler1.transform(input_data)
        
        # get probability estimates for all crops using Intel
        probabilities = model1.predict_proba(input_data_scaled)[0]
        
        crop_names = model1.classes_
        
        # create a list of (crop, probability)
        crop_probabilities = list(zip(crop_names, probabilities))
        
        # sorting the list by probability in descending order while showing result
        crop_probabilities.sort(key=lambda x: x[1], reverse=True)
        
        # return the top 5 crops with their probabilities
        top_predictions = [{"crop": crop, "probability": float(prob)} for crop, prob in crop_probabilities[:5]]
        
        print("Predictions:", top_predictions) 
        return jsonify({
            "status": "success",
            "predictions": top_predictions
        })
    except Exception as e:
        print("Error occurred:", str(e))  #debug
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 400
