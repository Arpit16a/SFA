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

backened_2= Blueprint('backened_2', __name__)

# Define model paths
MODEL_2_RF_PIPELINE = os.path.join('model', 'model_2','rf_pipeline.pkl' )
MODEL_2_SOIL_TYPE_ENCODER = os.path.join('model', 'model_2','soil_type_encoder.pkl' )
MODEL_2_CROP_TYPE_ENCODER = os.path.join('model', 'model_2','crop_type_encoder.pkl' )
MODEL_2_FERTNAME_ENCODER = os.path.join('model', 'model_2','fertname_encoder.pkl' )

# Load the model and encoders
rf_pipeline = pickle.load(open(MODEL_2_RF_PIPELINE, "rb"))
soil_type_encoder = pickle.load(open(MODEL_2_SOIL_TYPE_ENCODER, "rb"))
crop_type_encoder = pickle.load(open(MODEL_2_CROP_TYPE_ENCODER, "rb"))
fertname_encoder = pickle.load(open(MODEL_2_FERTNAME_ENCODER, "rb"))

#------model_2--------------------------------Fertilizer Recommendation-----------

@backened_2.route('/api/predict', methods=['POST'])
def predict2():
    data = request.json
    
    try:
        #extract and process features
        features = [
            float(data['temperature']),
            float(data['humidity']),
            float(data['moisture']),
            soil_type_encoder.transform([data['soil']])[0],
            crop_type_encoder.transform([data['crop']])[0],
            float(data['nitrogen']),
            float(data['potassium']),
            float(data['phosphorous'])
        ]
        
        # make prediction
        input_data = np.array([features])
        prediction = rf_pipeline.predict(input_data)
        
        # decode prediction
        fertilizer = fertname_encoder.inverse_transform(prediction)[0]
        
        return jsonify({'prediction': fertilizer})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400
