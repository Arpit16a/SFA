from flask import Flask, jsonify, Blueprint, request
from flask_cors import CORS
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
from datetime import datetime, timedelta

airquality_bp= Blueprint('airquality', __name__)

# Dictionary of important Indian cities with their coordinates
INDIAN_CITIES = {
    "Kanpur": {"latitude": 26.4652, "longitude": 80.3498},
    "Mumbai": {"latitude": 19.0760, "longitude": 72.8777},
    "Delhi": {"latitude": 28.6139, "longitude": 77.2090},
    "Bangalore": {"latitude": 12.9716, "longitude": 77.5946},
    "Chennai": {"latitude": 13.0827, "longitude": 80.2707},
    "Kolkata": {"latitude": 22.5726, "longitude": 88.3639},
    "Hyderabad": {"latitude": 17.3850, "longitude": 78.4867},
    "Ahmedabad": {"latitude": 23.0225, "longitude": 72.5714},
    "Pune": {"latitude": 18.5204, "longitude": 73.8567},
    "Jaipur": {"latitude": 26.9124, "longitude": 75.7873}
}

@airquality_bp.route('/api/air-quality', methods=['GET'])
def get_air_quality():
    city = request.args.get('city', 'Kanpur')
    
    if city not in INDIAN_CITIES:
        return jsonify({"error": "City not found"}), 404

    coordinates = INDIAN_CITIES[city]

    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # API parameters
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    params = {
        "latitude": coordinates["latitude"],
        "longitude": coordinates["longitude"],
        "current": ["pm10", "pm2_5", "carbon_monoxide", "uv_index", "uv_index_clear_sky"],
        "hourly": ["pm10", "pm2_5", "uv_index"],
        "past_days": 1,
        "forecast_days": 1
    }

    # Make the API request
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    # Process current air quality data
    current = response.Current()
    current_data = {
        "time": datetime.fromtimestamp(current.Time()).isoformat(),
        "pm10": current.Variables(0).Value(),
        "pm2_5": current.Variables(1).Value(),
        "carbon_monoxide": current.Variables(2).Value(),
        "uv_index": current.Variables(3).Value(),
        "uv_index_clear_sky": current.Variables(4).Value()
    }

    # Process hourly air quality data
    hourly = response.Hourly()
    hourly_time = hourly.Time()
    
    # Check if hourly_time is a single integer or a list
    if isinstance(hourly_time, int):
        # If it's a single integer, create a list of 48 hourly timestamps
        start_time = datetime.fromtimestamp(hourly_time)
        hourly_times = [start_time + timedelta(hours=i) for i in range(48)]
    else:
        # If it's already a list, convert each timestamp to datetime
        hourly_times = [datetime.fromtimestamp(t) for t in hourly_time]

    hourly_data = {
        "time": [t.isoformat() for t in hourly_times],
        "pm10": hourly.Variables(0).ValuesAsNumpy().tolist(),
        "pm2_5": hourly.Variables(1).ValuesAsNumpy().tolist(),
        "uv_index": hourly.Variables(2).ValuesAsNumpy().tolist()
    }

    return jsonify({
        "city": city,
        "current": current_data,
        "hourly": hourly_data
    })

@airquality_bp.route('/api/cities', methods=['GET'])
def get_cities():
    return jsonify(list(INDIAN_CITIES.keys()))
