import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearnex import patch_sklearn
patch_sklearn()
import torch
import torch.nn as nn
import torch.optim as optim
import intel_extension_for_pytorch as ipex
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CropDemandModel(nn.Module):
    def _init_(self, input_size):
        super(CropDemandModel, self)._init_()
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def load_and_preprocess_data():
    try:
        df_yearly = pd.read_csv('Crop_demand.csv')
        df_monthly = pd.read_csv('Crop_price.csv')

        selected_crops = ['Rice', 'Wheat', 'Corn']
        df_yearly = df_yearly[df_yearly['Crop'].isin(selected_crops)]

        present_crops = df_yearly['Crop'].unique()
        logger.info(f"Crops present in the data: {', '.join(present_crops)}")

        df_monthly['Year'] = df_monthly['Year'].astype(int)
        df_price_yearly = df_monthly.groupby(['Crop', 'Year'])['Price'].mean().reset_index()

        df_combined = pd.merge(df_yearly, df_price_yearly, on=['Crop', 'Year'], how='left')
        df_combined['Price'].fillna(df_combined.groupby('Crop')['Price'].transform('mean'), inplace=True)

        crop_encodings = {crop: idx for idx, crop in enumerate(selected_crops)}
        df_combined['Crop_Encoded'] = df_combined['Crop'].map(crop_encodings)

        df_combined = df_combined.sort_values(['Crop', 'Year'])
        df_combined['Prev_Demand'] = df_combined.groupby('Crop')['Demand'].shift(1)

        features = ['Year', 'Crop_Encoded', 'Import', 'Export', 'Production', 'Yield', 'Price', 'Prev_Demand']
        target = 'Demand'

        df_combined = df_combined.dropna(subset=['Prev_Demand'])

        X = df_combined[features].values
        y = df_combined[target].values

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        logger.info(f"Data shape: X={X_scaled.shape}, y={y.shape}")
        return X_scaled, y, crop_encodings, df_combined['Year'].max(), scaler
    except Exception as e:
        logger.error(f"Error in data preprocessing: {e}")
        raise

def train_model(X_scaled, y):
    try:
        X_tensor = torch.FloatTensor(X_scaled)
        y_tensor = torch.FloatTensor(y).reshape(-1, 1)

        model = CropDemandModel(X_scaled.shape[1])
        optimizer = optim.Adam(model.parameters(), lr=0.001)

        model, optimizer = ipex.optimize(model, optimizer=optimizer)

        criterion = nn.MSELoss()

        num_epochs = 1000
        batch_size = 32

        for epoch in range(num_epochs):
            model.train()
            for i in range(0, len(X_tensor), batch_size):
                batch_X = X_tensor[i:i+batch_size]
                batch_y = y_tensor[i:i+batch_size]
                
                optimizer.zero_grad()
                outputs = model(batch_X)
                loss = criterion(outputs, batch_y)
                loss.backward()
                optimizer.step()
            
            if (epoch + 1) % 100 == 0:
                model.eval()
                with torch.no_grad():
                    total_loss = criterion(model(X_tensor), y_tensor)
                logger.info(f'Epoch [{epoch+1}/{num_epochs}], Loss: {total_loss.item():.4f}')

        return model
    except Exception as e:
        logger.error(f"Error in model training: {e}")
        raise

def save_model_and_data(model, X_scaled, y, crop_encodings, latest_year, scaler):
    try:
        torch.save(model.state_dict(), 'crop_demand_model.pth')
        np.save('X_scaled.npy', X_scaled)
        np.save('y.npy', y)
        np.save('crop_encodings.npy', crop_encodings)
        np.save('latest_year.npy', latest_year)
        torch.save(scaler, 'scaler.pth')
        logger.info("Model and data saved successfully")
    except Exception as e:
        logger.error(f"Error in saving model and data: {e}")
        raise

if __name__ == "__main__":
    try:
        X_scaled, y, crop_encodings, latest_year, scaler = load_and_preprocess_data()
        model = train_model(X_scaled, y)
        save_model_and_data(model, X_scaled, y, crop_encodings, latest_year, scaler)
        logger.info("Model training and data saving completed successfully.")
    except Exception as e:
        logger.error(f"An error occurred in the main process: {e}")