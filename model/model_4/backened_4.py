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

backened_4= Blueprint('backened_4', __name__)

# Define model paths
MODEL_4_PATH_CROP_PREDICTION_MODEL = os.path.join('model', 'model_4','crop_prediction_model2.joblib' )
MODEL_4_PATH_STATE = os.path.join('model', 'model_4','le_state2.joblib' )
MODEL_4_PATH_LE_SEASON = os.path.join('model', 'model_4','le_season2.joblib' )
MODEL_4_PATH_LE_CROP = os.path.join('model', 'model_4','le_crop2.joblib' )
MODEL_4_CROP_YIELD_CSV = os.path.join('model', 'model_4', 'crop_yield.csv')

# Load the model and encoders
model4 = joblib.load(MODEL_4_PATH_CROP_PREDICTION_MODEL)
le_season2 = joblib.load(MODEL_4_PATH_LE_SEASON)
le_state2 = joblib.load(MODEL_4_PATH_STATE)
le_crop2 = joblib.load(MODEL_4_PATH_LE_CROP)

# Load datasets
pd.read_csv(MODEL_4_CROP_YIELD_CSV)


#---------model_4-------------Simple Crop Recommendation----------------------

@backened_4.route('/simple-predict', methods=['POST'])
def predict():
    data = request.json
    season = data['season']
    state = data['state']
    features1 = np.array([[
        le_season2.transform([data['season']])[0],
        le_state2.transform([data['state']])[0],
        data['season'],
        data['state']
    ]])
    prediction = predict_crop(season, state)
    prediction = predict_crop(season, state)
    return jsonify({'prediction': prediction})


