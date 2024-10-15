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

backened_3= Blueprint('backened_3', __name__)

# Define model paths
MODEL_3_PATH_CROP_DEMAND = os.path.join('model', 'model_3','Crop_demand.csv' )
MODEL_3_PATH_CROP_PRICE = os.path.join('model', 'model_3','Crop_price.csv' )
MODEL_3_PATH_CROP_DEMAND_MODEL = os.path.join('model', 'model_3','crop_demand_model.pth' )
MODEL_3_PATH_SCALER = os.path.join('model', 'model_3','scaler.pth' )
MODEL_3_PATH_X_SCALED = os.path.join('model', 'model_3','X_scaled.npy' )
MODEL_3_PATH_CROP_ENCODINGS = os.path.join('model', 'model_3','crop_encodings.npy' )
MODEL_3_PATH_LATEST_YEAR = os.path.join('model', 'model_3','latest_year.npy' )

# Load datasets

#model_3
df_demand = pd.read_csv(MODEL_3_PATH_CROP_DEMAND)
df_price = pd.read_csv(MODEL_3_PATH_CROP_PRICE)

# FUNCTION of BACKEND

        #model_3 only
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CropDemandModel(torch.nn.Module):
    def __init__(self, input_size):
        super(CropDemandModel, self).__init__()
        self.fc1 = torch.nn.Linear(input_size, 64)
        self.fc2 = torch.nn.Linear(64, 32)
        self.fc3 = torch.nn.Linear(32, 1)
        self.relu = torch.nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def load_model_and_data():
    try:
        model = CropDemandModel(input_size=8)
        model.load_state_dict(torch.load(MODEL_3_PATH_CROP_DEMAND_MODEL))
        model.eval()
        
        X_scaled = np.load(MODEL_3_PATH_X_SCALED)
        crop_encodings = np.load(MODEL_3_PATH_CROP_ENCODINGS, allow_pickle=True).item()
        latest_year = np.load(MODEL_3_PATH_LATEST_YEAR)
        scaler = torch.load(MODEL_3_PATH_SCALER)
        
        # Load original data for fallback predictions
        df_yearly = pd.read_csv(MODEL_3_PATH_CROP_DEMAND)
        
        logger.info(f"Model and data loaded successfully. Crop encodings: {crop_encodings}")
        return model, X_scaled, crop_encodings, latest_year, scaler, df_yearly
    except Exception as e:
        logger.error(f"Error in loading model and data: {e}")
        raise

def predict_next_year(model, scaler, X, crop_encodings, latest_year, df_yearly):
    try:
        next_year = latest_year + 1
        predictions = {}
        
        for crop, encoding in crop_encodings.items():
            crop_data = df_yearly[df_yearly['Crop'] == crop].sort_values('Year')
            if len(crop_data) == 0:
                logger.warning(f"No data found for crop: {crop}")
                continue
            
            # Use the last 3 years of data to calculate the average growth rate
            last_3_years = crop_data.tail(3)
            growth_rates = (last_3_years['Demand'].pct_change() + 1).dropna()
            avg_growth_rate = growth_rates.mean()
            
            # fetch the last known demand
            last_known_demand = crop_data['Demand'].iloc[-1]
            
            # Predict
            crop_scaled_data = X[X[:, 1] == encoding]
            if len(crop_scaled_data) > 0:
                latest_crop_data = crop_scaled_data[-1]
                prev_demand = latest_crop_data[-1]
                next_year_data = np.array([[next_year, encoding] + list(latest_crop_data[2:-1]) + [prev_demand]])
                next_year_scaled = scaler.transform(next_year_data)
                next_year_tensor = torch.FloatTensor(next_year_scaled)
                
                with torch.no_grad():
                    model_prediction = model(next_year_tensor)
                model_prediction = float(model_prediction.numpy()[0][0])
            else:
                model_prediction = None
            
            # Fallback prediction using average growth rate
            fallback_prediction = last_known_demand * avg_growth_rate
            
            # Use model prediction if it's reasonable, otherwise use fallback
            if model_prediction and 0.9 * last_known_demand <= model_prediction <= 1.1 * last_known_demand:
                predictions[crop] = model_prediction
            else:
                predictions[crop] = fallback_prediction
            
            logger.info(f"{crop}: Model prediction: {model_prediction}, Fallback prediction: {fallback_prediction}, Final prediction: {predictions[crop]}")
        
        logger.info("Predictions generated successfully")
        return predictions, next_year
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise

model, X_scaled, crop_encodings, latest_year, scaler, df_yearly = load_model_and_data()


#---------model 3---------------------Food Demand this Year--------------------
@backened_3.route('/predictions', methods=['GET'])
def predict3():
    try:
        predictions, next_year = predict_next_year(model, scaler, X_scaled, crop_encodings, latest_year, df_yearly)
        response = {
            'year': int(next_year),
            'predictions': predictions
        }
        logger.info(f"Prediction request processed successfully. Response: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        return jsonify({'error': 'An error occurred during prediction'}), 500


