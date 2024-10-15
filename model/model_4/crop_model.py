import pandas as pd
import numpy as np
import sklearn
from sklearnex import patch_sklearn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os


# model_4
MODEL_4_PATH_CROP_PREDICTION_MODEL = os.path.join('model', 'model_4','crop_prediction_model2.joblib' )
MODEL_4_PATH_STATE = os.path.join('model', 'model_4','le_state2.joblib' )
MODEL_4_PATH_LE_SEASON = os.path.join('model', 'model_4','le_season2.joblib' )
MODEL_4_PATH_LE_CROP = os.path.join('model', 'model_4','le_crop2.joblib' )
MODEL_4_PATH_CLEANED_CROP_DATA = os.path.join('model', 'model_4','cleaned_crop_data.csv' )
MODEL_4_PATH_CROP_YIELD = os.path.join('model', 'model_4','crop_yield.csv' )


df = pd.read_csv(MODEL_4_PATH_CROP_YIELD)

def clean_column(col):
    return col.strip() if isinstance(col, str) else col

for column in df.columns:
    df[column] = df[column].apply(clean_column)

df.to_csv(MODEL_4_PATH_CLEANED_CROP_DATA, index=False)
print("Cleaned data saved to 'cleaned_crop_data.csv'")

X = df[['Season', 'State', 'Annual_Rainfall', 'Production', 'Yield']]
y = df['Crop']

#labelling
le_season2 = LabelEncoder()
le_state2 = LabelEncoder()
le_crop2 = LabelEncoder()

X['Season'] = le_season2.fit_transform(X['Season'])
X['State'] = le_state2.fit_transform(X['State'])
y = le_crop2.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy}")

joblib.dump(clf, MODEL_4_PATH_CROP_PREDICTION_MODEL)
joblib.dump(le_season2, MODEL_4_PATH_LE_SEASON)
joblib.dump(le_state2, MODEL_4_PATH_STATE)
joblib.dump(le_crop2, MODEL_4_PATH_LE_CROP)

def predict_crop(season, state):
    
    model = joblib.load(MODEL_4_PATH_CROP_PREDICTION_MODEL)
    le_season = joblib.load(MODEL_4_PATH_LE_SEASON)
    le_state = joblib.load(MODEL_4_PATH_STATE)
    le_crop = joblib.load(MODEL_4_PATH_LE_CROP)
    
    df = pd.read_csv(MODEL_4_PATH_CLEANED_CROP_DATA)
    
    #encoding input
    season_encoded = le_season.transform([season.strip()])[0]
    state_encoded = le_state.transform([state.strip()])[0]
    
    avg_rainfall = df['Annual_Rainfall'].mean()
    avg_production = df['Production'].mean()
    avg_yield = df['Yield'].mean()
    
    input_data = [[season_encoded, state_encoded, avg_rainfall, avg_production, avg_yield]]
    prediction = model.predict_proba(input_data)
    
    top_5_indices = prediction[0].argsort()[-5:][::-1]
    top_5_crops = le_crop.inverse_transform(top_5_indices)
    
    return top_5_crops.tolist()
