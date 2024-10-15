import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from openvino.runtime import Core

data = pd.read_csv('Fertilizer.csv')

#separate
X = data[['Temperature', 'Humidity', 'Moisture', 'Soil', 'Crop', 'Nitrogen', 'Potassium', 'Phosphorous']]
y = data['Fertilizer']

#encoding strings dataset column
le_soil = LabelEncoder()
le_crop = LabelEncoder()
le_fertiliser = LabelEncoder()

X['Soil'] = le_soil.fit_transform(X['Soil'])
X['Crop'] = le_crop.fit_transform(X['Crop'])
y = le_fertiliser.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#scaling numerical
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

#train the model using TensorFlow
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(8,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(len(le_fertiliser.classes_), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.2, verbose=1)


model.save('fertilizer_model.h5')

#load and compile the model with OpenVINO
core = Core()
ov_model = core.read_model('fertilizer_model.h5')
compiled_model = core.compile_model(ov_model)

#to make predictions
def predict_fertilizer(temperature, humidity, moisture, soil, crop, nitrogen, potassium, phosphorous):
    input_data = np.array([[temperature, humidity, moisture, 
                            le_soil.transform([soil])[0], 
                            le_crop.transform([crop])[0], 
                            nitrogen, potassium, phosphorous]])
    input_data = scaler.transform(input_data)
    output = compiled_model(input_data)[0]
    fertilizer_index = np.argmax(output)
    return le_fertiliser.inverse_transform([fertilizer_index])[0]

#ex
print(predict_fertilizer(25, 60, 40, 'Clay', 'Wheat', 50, 30, 20))