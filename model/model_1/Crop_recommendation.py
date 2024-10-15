import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Patch sklearn with Intel optimizations
from sklearnex import patch_sklearn
patch_sklearn()

# Import Intel oneDAL components
from sklearn.preprocessing import StandardScaler
from sklearnex.ensemble import RandomForestClassifier

# Load the dataset
data = pd.read_csv('Crop_recommendation.csv')

# Separate features and target
X = data.drop('label', axis=1)
y = data['label']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features using Intel oneDAL
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train the model using Intel oneDAL
model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")
print(classification_report(y_test, y_pred))

# Get feature importances
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Feature Importances:")
print(feature_importance)

# Save the model and scaler
joblib.dump(model, 'crop_prediction_model_intel.joblib')
joblib.dump(scaler, 'scaler_intel.joblib')

# Function to make predictions
def predict_crops(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, top_n=5):
    input_data = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
    input_data_scaled = scaler.transform(input_data)
    
    # Get probability estimates for all crops
    probabilities = model.predict_proba(input_data_scaled)[0]
    
    # Get the crop names (classes)
    crop_names = model.classes_
    
    # Create a list of (crop, probability) tuples
    crop_probabilities = list(zip(crop_names, probabilities))
    
    # Sort the list by probability in descending order
    crop_probabilities.sort(key=lambda x: x[1], reverse=True)
    
    # Return the top N crops with their probabilities
    return crop_probabilities[:top_n]

# Example usage
if __name__ == "__main__":
    # Example input data
    nitrogen = 90
    phosphorus = 42
    potassium = 43
    temperature = 20.87
    humidity = 82.00
    ph = 6.5
    rainfall = 202.935

    top_crops = predict_crops(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
    print("\nTop 5 predicted crops:")
    for crop, probability in top_crops:
        print(f"{crop}: {probability:.2%}")