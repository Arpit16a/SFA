import os
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import pandas as pd
from scipy import optimize
from sklearnex import patch_sklearn
patch_sklearn()
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from scipy.optimize import linprog
import numpy as np
from datetime import datetime
import uuid
import math
from pymongo import MongoClient
from bson import ObjectId
from socketio_instance import socketio


backened5= Blueprint('backened5', __name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client['agriculture']

# Load collections
data_collection = db['FACT_DATA']
inventory_collection = db['INVENTORY']
cost_collection = db['COST_REDISTRIBUTION']
past_requests_collection = db['PAST_REQUESTS']
emissions_collection = db['EMISSIONS']

# Load data from MongoDB collections
data = pd.DataFrame(list(data_collection.find()))
inventory_data = pd.DataFrame(list(inventory_collection.find()))
cost_data = pd.DataFrame(list(cost_collection.find()))
past_requests = pd.DataFrame(list(past_requests_collection.find()))

# Create and fit label encoders
le_state = LabelEncoder()
le_crop = LabelEncoder()
le_state.fit(data['STATE'])
le_crop.fit(data['CROP'])

# Transform categorical data
data['STATE_ENCODED'] = le_state.transform(data['STATE'])
data['CROP_ENCODED'] = le_crop.transform(data['CROP'])
data['TYPE_ENCODED'] = data['TYPE'].map({'Shortage': 0, 'Surplus': 1})

# Prepare features and target
X = data[['STATE_ENCODED', 'CROP_ENCODED', 'CULTIVATION_PERIOD', 'MONTHLY_PRODUCTION', 'MONTHLY_CONSUMPTION']]
y = data['TYPE_ENCODED']

# Train model using intel optimised scikit-learn 
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Global variable to store real-time requests
real_time_requests = []

@socketio.on_error_default
def default_error_handler(e):
    print(f"An error occurred: {str(e)}")

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@backened5.route('/predict-supply', methods=['POST'])
def predict():
    state = request.json['state']
    state_encoded = le_state.transform([state])[0]
    
    predictions = []
    for _, row in data[data['STATE'] == state].iterrows():
        crop_encoded = le_crop.transform([row['CROP']])[0]
        input_data = [[state_encoded, crop_encoded, row['CULTIVATION_PERIOD'], row['MONTHLY_PRODUCTION'], row['MONTHLY_CONSUMPTION']]]
        prediction = model.predict(input_data)
        prediction_type = "Surplus" if prediction[0] > 0.5 else "Shortage"
        predictions.append({
            'crop': row['CROP'],
            'prediction': prediction_type
        })
    
    return jsonify(predictions)

def calculate_cost(from_state, to_state, quantity):
    cost_per_tonne = cost_data[(cost_data['STATE'] == from_state) & (cost_data['OTHER STATE'] == to_state)]['COST(per_tonne)'].iloc[0]
    return cost_per_tonne * quantity

def calculate_emission(distance, quantity, truck_type):
    if truck_type == 'DIESEL':
        num_trucks = math.ceil(quantity / 25)
        return (2.6444 / 3.33) * distance * num_trucks
    else:
        return 0


# Helper function to recursively convert all numpy and pandas types to native Python types
def convert_to_native_types(obj):
    if isinstance(obj, dict):
        return {k: convert_to_native_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_native_types(i) for i in obj]
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        return float(obj)
    elif isinstance(obj, (pd.Timestamp)):
        return obj.to_pydatetime()
    else:
        return obj

@backened5.route('/optimize-all-routes', methods=['GET'])
def optimize_all_routes():
    results = {}

    for crop in data['CROP'].unique():
        crop_data = data[data['CROP'] == crop].copy()

        crop_data['NET_PRODUCTION'] = crop_data['MONTHLY_PRODUCTION'] - crop_data['MONTHLY_CONSUMPTION']

        surplus_states = crop_data[crop_data['NET_PRODUCTION'] > 0]['STATE'].tolist()
        shortage_states = crop_data[crop_data['NET_PRODUCTION'] < 0]['STATE'].tolist()

        if not surplus_states or not shortage_states:
            continue

        supply = crop_data[crop_data['NET_PRODUCTION'] > 0]['NET_PRODUCTION'].to_numpy()
        demand = -crop_data[crop_data['NET_PRODUCTION'] < 0]['NET_PRODUCTION'].to_numpy()

        cost_matrix = np.zeros((len(surplus_states), len(shortage_states)))
        for i, surplus_state in enumerate(surplus_states):
            for j, shortage_state in enumerate(shortage_states):
                cost_data_filtered = cost_data[(cost_data['STATE'] == surplus_state) & (cost_data['OTHER STATE'] == shortage_state)]
                if cost_data_filtered.empty:
                    cost_matrix[i, j] = np.inf
                else:
                    cost_matrix[i, j] = cost_data_filtered['DISTANCE'].iloc[0]

        A_eq = np.zeros((len(shortage_states), len(surplus_states) * len(shortage_states)))
        for i in range(len(shortage_states)):
            A_eq[i, i::len(shortage_states)] = 1

        A_ub = np.eye(len(surplus_states) * len(shortage_states))
        b_ub = np.tile(supply, len(shortage_states))

        cost_matrix_flat = cost_matrix.flatten()

        #use of intel MKL optimised scipy.optimised.lingprog

        res = optimize.linprog(c=cost_matrix_flat, A_eq=A_eq, b_eq=demand, A_ub=A_ub, b_ub=b_ub, method='highs')

        if res.success:
            result = res.x.reshape((len(surplus_states), len(shortage_states)))
            redistribution = []
            for i, from_state in enumerate(surplus_states):
                for j, to_state in enumerate(shortage_states):
                    if result[i, j] > 0:
                        redistribution.append({
                            'from': from_state,
                            'to': to_state,
                            'quantity': float(result[i, j])  # Convert to native float
                        })
            if redistribution:
                results[crop] = {
                    'redistribution': redistribution,
                    'total_cost': float(res.fun)  # Convert to native float
                }

    # Fetch incomplete requests from MongoDB
    incomplete_requests = list(db.real_time_requests_collection.find({'Status': 'Incomplete'}))

    for crop in results:
        for route in results[crop]['redistribution']:
            route['cost'] = float(calculate_cost(route['from'], route['to'], route['quantity']))  # Ensure cost is native float

    results_native = convert_to_serializable(results)
    incomplete_requests_native = convert_to_serializable(incomplete_requests)

    return jsonify({
        'optimizedRoutes': results_native,
        'incompleteRequests': incomplete_requests_native
    })

@backened5.route('/inventory', methods=['GET'])
def get_inventory():
    inventory_data = list(inventory_collection.find())
    
    # Convert ObjectId to string for JSON serialization
    for item in inventory_data:
        item['_id'] = str(item['_id'])
    
    return jsonify(inventory_data)

@backened5.route('/past-requests', methods=['GET'])
def get_past_requests():
    # Fetch past requests from MongoDB
    past_requests = pd.DataFrame(list(past_requests_collection.find()))

    # Print the raw data for debugging
    print("Raw Past Requests Data:", past_requests)

    # Check if 'DATE' is in the DataFrame and convert to datetime
    if 'DATE' in past_requests.columns:
        # Ensure that DATE is converted correctly
        try:
            past_requests['DATE'] = pd.to_datetime(past_requests['DATE'], errors='coerce')  # Coerce errors to NaT
        except Exception as e:
            return jsonify({"error": str(e)}), 500  # Handle unexpected issues

    # Sort the DataFrame by DATE
    past_requests = past_requests.sort_values('DATE', ascending=False)

    # Format the requests and rename columns
    formatted_requests = past_requests[['DATE', 'STATE', 'CROP', 'TYPE', 'QUANTITY', 'STATUS']].rename(columns={
        'DATE': 'Date',
        'STATE': 'State',
        'CROP': 'Crop',
        'TYPE': 'Type',
        'QUANTITY': 'Quantity',
        'STATUS': 'Status'
    })

    # Convert Date to string format, handling NaT values
    formatted_requests['Date'] = formatted_requests['Date'].dt.strftime('%Y-%m-%d')
    formatted_requests = formatted_requests.fillna({'Date': 'N/A'})  # Fill NaT with a placeholder if necessary

    # Print the formatted requests for debugging
    print("Formatted Past Requests Data:", formatted_requests)

    # Return the formatted requests as JSON
    return jsonify(formatted_requests.to_dict('records'))

@backened5.route('/realtime-request', methods=['POST'])
def realtime_request():
    global real_time_requests
    try:
        state = request.json.get('state')
        crop = request.json.get('crop')
        request_type = request.json.get('type')
        quantity = float(request.json.get('quantity'))

        request_id = str(uuid.uuid4())

        optimized_routes = find_optimized_routes(state, crop, quantity, request_type)

        # Check if optimized_routes is None
        if optimized_routes is None:
            return jsonify({"error": "No optimized routes found for the given request"}), 400

        # Set current date as a datetime object
        current_date = datetime.now()  # Store as datetime object

        new_request = {
            'id': request_id,
            'Date': current_date,  # Store as datetime object
            'State': state,
            'Crop': crop,
            'Type': request_type,
            'Quantity': quantity,
            'Status': 'Incomplete',
            'OptimizedRoutes': optimized_routes
        }

        for route in optimized_routes:
            route['cost'] = calculate_cost(route['from'], route['to'], route['quantity'])

        # Save the real-time request in MongoDB
        db.real_time_requests_collection.insert_one(new_request)

        new_past_request = {
            'DATE': current_date,  # Store as datetime object
            'STATE': state,
            'CROP': crop,
            'TYPE': request_type,
            'QUANTITY': quantity,
            'STATUS': 'Incomplete'
        }
        past_requests_collection.insert_one(new_past_request)  # Ensure this is also datetime

        return jsonify({
            "message": "Request added successfully",
            "requestId": request_id,
            "optimizedRoutes": convert_to_serializable(optimized_routes)  # Convert to serializable types
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@backened5.route('/farmer-realtime-request', methods=['POST'])
def farmer_realtime_request():
    try:
        state = request.json['state']
        crop = request.json['crop']
        request_type = request.json['type']
        quantity = float(request.json['quantity'])
        
        request_id = str(uuid.uuid4())
        
        # Create a new request dictionary
        new_request = {
            'id': request_id,
            'Date': datetime.now().strftime("%Y-%m-%d"),
            'State': state,
            'Crop': crop,
            'Type': request_type,
            'Quantity': quantity,
            'Status': 'Incomplete',
            'from': 'Farmer'
        }
        
        # Store the request in MongoDB
        db.real_time_requests_collection.insert_one(new_request)  # Change 'real_time_requests_collection' to your actual collection name
        
        # Optional: Append to in-memory requests for real-time updates
        real_time_requests.append(new_request)  # Keep this if you want immediate socket updates
        
        # Add to past requests
        new_past_request = {
            'DATE': datetime.now().strftime("%Y-%m-%d"),
            'STATE': state,
            'from': 'Farmer',
            'CROP': crop,
            'TYPE': request_type,
            'QUANTITY': quantity,
            'STATUS': 'Incomplete'
        }
        db['PAST_REQUESTS'].insert_one(new_past_request)
        
        # Emit updates via sockets
        socketio.emit('real_time_request_update', real_time_requests)  # This will emit the updated in-memory requests
        socketio.emit('past_requests_update', get_past_requests().json)
        
        return jsonify({
            "message": "Request added successfully",
            "requestId": request_id,
            "optimizedRoute": ""
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def find_optimized_routes(state, crop, quantity, request_type):
    crop_data = pd.DataFrame(list(db['FACT_DATA'].find({"CROP": crop, "STATE": {"$ne": state}})))
    crop_data['NET_PRODUCTION'] = crop_data['MONTHLY_PRODUCTION'] - crop_data['MONTHLY_CONSUMPTION']
    
    if request_type == 'Shortage':
        potential_states = crop_data[crop_data['NET_PRODUCTION'] > 0]['STATE'].tolist()
        if not potential_states:
            return None
        
        distances = pd.DataFrame(list(cost_collection.find({"STATE": {"$in": potential_states}, "OTHER STATE": state})))
        if distances.empty:
            return None
        
        sorted_states = distances.sort_values(by='DISTANCE').index
        
        routes = []
        remaining_quantity = quantity
        for idx in sorted_states:
            source_state = distances.loc[idx, 'STATE']
            source_stock = inventory_collection.find_one({"STATE": source_state, "CROP": crop})['STOCK']
            source_monthly_consumption = crop_data[crop_data['STATE'] == source_state]['MONTHLY_CONSUMPTION'].iloc[0]
            
            max_available = source_stock - (0.3 * source_monthly_consumption)
            if max_available <= 0:
                continue
            
            transfer_quantity = min(remaining_quantity, max_available)
            routes.append({
                'from': source_state,
                'to': state,
                'quantity': transfer_quantity
            })
            
            remaining_quantity -= transfer_quantity
            if remaining_quantity <= 0 or len(routes) == 2:
                break
        
        return routes if routes else None
    
    else:  # Surplus
        potential_states = crop_data[crop_data['NET_PRODUCTION'] < 0]['STATE'].tolist()
        if not potential_states:
            return None
        
        distances = pd.DataFrame(list(cost_collection.find({"STATE": state, "OTHER STATE": {"$in": potential_states}})))
        if distances.empty:
            return None
        
        sorted_states = distances.sort_values(by='DISTANCE').index
        
        routes = []
        remaining_quantity = quantity
        for idx in sorted_states:
            destination_state = distances.loc[idx, 'OTHER STATE']
            destination_stock = inventory_collection.find_one({"STATE": destination_state, "CROP": crop})['STOCK']
            destination_monthly_consumption = crop_data[crop_data['STATE'] == destination_state]['MONTHLY_CONSUMPTION'].iloc[0]
            
            max_needed = (0.6 * destination_monthly_consumption) - destination_stock
            if max_needed <= 0:
                continue
            
            transfer_quantity = min(remaining_quantity, max_needed)
            routes.append({
                'from': state,
                'to': destination_state,
                'quantity': transfer_quantity
            })
            
            remaining_quantity -= transfer_quantity
            if remaining_quantity <= 0 or len(routes) == 2:
                break
        
        return routes if routes else None

real_time_requests = []  # In-memory real-time requests

def convert_to_serializable(data):
    if isinstance(data, list):
        return [convert_to_serializable(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_to_serializable(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)  # Convert ObjectId to string
    elif isinstance(data, (np.int64, np.int32)):
        return int(data)  # Convert numpy integers to native Python int
    elif isinstance(data, (np.float64, np.float32)):
        return float(data)  # Convert numpy floats to native Python float
    elif isinstance(data, datetime):
        return data.isoformat()  # Convert datetime to ISO 8601 string format
    return data

@backened5.route('/accept-request', methods=['POST'])
def accept_request():
    request_id = request.json.get('requestId')
    truck_type = request.json.get('truckType')

    # Find the request to update from MongoDB
    request_to_update = db.real_time_requests_collection.find_one({'id': request_id})
    
    if not request_to_update:
        return jsonify({"error": "Request not found"}), 404

    # Update inventory in MongoDB
    for route in request_to_update['OptimizedRoutes']:
        # Ensure quantity is converted to a standard int or float
        route['quantity'] = convert_to_serializable(route['quantity'])

        # Decrease stock for the 'from' state and increase stock for the 'to' state
        inventory_collection.update_one(
            {'STATE': route['from'], 'CROP': request_to_update['Crop']},
            {'$inc': {'STOCK': -route['quantity']}}
        )
        inventory_collection.update_one(
            {'STATE': route['to'], 'CROP': request_to_update['Crop']},
            {'$inc': {'STOCK': route['quantity']}}
        )

    # Update request status in MongoDB
    db.real_time_requests_collection.update_one(
    {'id': request_to_update['id']},  # Filter to find the document by its unique id
    {'$set': {'Status': 'Completed'}}  # Update the Status field to Completed
    )
    past_requests_collection.update_one(
        {'DATE': request_to_update['Date'], 'STATE': request_to_update['State'], 
        'CROP': request_to_update['Crop'], 'TYPE': request_to_update['Type'], 
        'QUANTITY': request_to_update['Quantity']},
        {'$set': {'STATUS': 'Completed'}}
    )

    # Calculate and store emission data in MongoDB
    for route in request_to_update['OptimizedRoutes']:
        distance = cost_collection.find_one(
            {'STATE': route['from'], 'OTHER STATE': route['to']}
        )['DISTANCE']

        emission = calculate_emission(distance, route['quantity'], truck_type)
        cost = calculate_cost(route['from'], route['to'], route['quantity'])

        new_emission_data = {
            'DATE': datetime.now().isoformat(),  # Convert datetime to string
            'FROM': route['from'],
            'TO': route['to'],
            'DISTANCE': convert_to_serializable(distance),  # Convert distance if it's numpy type
            'TRUCK': truck_type,
            'EMISSION': convert_to_serializable(emission),  # Convert emission
            'COST': convert_to_serializable(cost)  # Convert cost
        }

        emissions_collection.insert_one(convert_to_serializable(new_emission_data))  # Convert before insert

    # Emit socket events for real-time updates
    updated_inventory = convert_to_serializable(list(inventory_collection.find()))
    updated_past_requests = convert_to_serializable(list(past_requests_collection.find()))
    updated_emissions = convert_to_serializable(list(emissions_collection.find()))

    # Convert real_time_requests to a serializable format
    # serializable_real_time_requests = convert_to_serializable(list(db.real_time_requests_collection.find()))

    socketio.emit('inventory_update', updated_inventory)
    # socketio.emit('real_time_request_update', serializable_real_time_requests)  # Convert before emitting
    socketio.emit('past_requests_update', updated_past_requests)
    socketio.emit('emissions_update', updated_emissions)

    return jsonify(convert_to_serializable({"message": "Request accepted and processed successfully"}))

@backened5.route('/farmer-accept-request', methods=['POST'])
def farmer_accept_request():
    request_id = request.json.get('requestId')
    truck_type = request.json.get('truckType')

    # Find the request to update from MongoDB
    request_to_update = db.real_time_requests_collection.find_one({'id': request_id})
    
    if not request_to_update:
        return jsonify({"error": "Request not found"}), 404

    # increase stock for the 'to' state
    inventory_collection.update_one(
        {'STATE': request_to_update['State'], 'CROP': request_to_update['Crop']},
        {'$inc': {'STOCK': request_to_update['Quantity']}}
    )

    # Update request status in MongoDB
    db.real_time_requests_collection.update_one(
    {'id': request_to_update['id']},  # Filter to find the document by its unique id
    {'$set': {'Status': 'Completed'}}  # Update the Status field to Completed
    )
    past_requests_collection.update_one(
        {'DATE': request_to_update['Date'], 'STATE': request_to_update['State'], 
        'CROP': request_to_update['Crop'], 'TYPE': request_to_update['Type'], 
        'QUANTITY': request_to_update['Quantity']},
        {'$set': {'STATUS': 'Completed'}}
    )

    # Emit socket events for real-time updates
    updated_inventory = convert_to_serializable(list(inventory_collection.find()))
    updated_past_requests = convert_to_serializable(list(past_requests_collection.find()))
    # updated_emissions = convert_to_serializable(list(emissions_collection.find()))

    # Convert real_time_requests to a serializable format
    # serializable_real_time_requests = convert_to_serializable(list(db.real_time_requests_collection.find()))

    socketio.emit('inventory_update', updated_inventory)
    # socketio.emit('real_time_request_update', serializable_real_time_requests)  # Convert before emitting
    socketio.emit('past_requests_update', updated_past_requests)
    # socketio.emit('emissions_update', updated_emissions)

    return jsonify(convert_to_serializable({"message": "Request accepted and processed successfully"}))


@backened5.route('/emissions', methods=['GET'])
def get_emissions():
    emissions_data = list(emissions_collection.find())
    
    # Convert ObjectId to string for JSON serialization
    for emission in emissions_data:
        emission['_id'] = str(emission['_id'])
    
    return jsonify(emissions_data)



@backened5.route('/get-distance', methods=['GET'])
def get_distance():
    from_state = request.args.get('from')
    to_state = request.args.get('to')

    if not from_state or not to_state:
        return jsonify({"error": "Both 'from' and 'to' parameters are required"}), 400
    
    distance = cost_collection.find_one({'STATE': from_state, 'OTHER STATE': to_state})['DISTANCE']
    
    return jsonify({"distance": float(distance)})

