from flask import jsonify,Blueprint,request
import openmeteo_requests
import requests_cache
from retry_requests import retry
from datetime import datetime, timedelta

weather_bp= Blueprint('weather', __name__)

@weather_bp.route('/api/weather', methods=['GET'])
def get_weather():
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)
    # API parameters
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 26.4652,
        "longitude": 80.3498,
        "current": ["temperature_2m", "relative_humidity_2m", "is_day", "precipitation", "rain", "cloud_cover"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "uv_index_max", "precipitation_sum"],
        "timezone": "auto",
        "forecast_days": 7
    }
    # Make the API request
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]
    # Process current weather data
    current = response.Current()
    current_data = {
        "temperature": current.Variables(0).Value(),
        "humidity": current.Variables(1).Value(),
        "is_day": current.Variables(2).Value(),
        "precipitation": current.Variables(3).Value(),
        "rain": current.Variables(4).Value(),
        "cloud_cover": current.Variables(5).Value()
    }
    # Process daily forecast data
    daily = response.Daily()
    start_date = datetime.fromtimestamp(daily.Time())
    daily_data = {
        "date": [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)],
        "max_temp": daily.Variables(0).ValuesAsNumpy().tolist(),
        "min_temp": daily.Variables(1).ValuesAsNumpy().tolist(),
        "apparent_temp_max": daily.Variables(2).ValuesAsNumpy().tolist(),
        "apparent_temp_min": daily.Variables(3).ValuesAsNumpy().tolist(),
        "uv_index_max": daily.Variables(4).ValuesAsNumpy().tolist(),
        "precipitation_sum": daily.Variables(5).ValuesAsNumpy().tolist()
    }
    return jsonify({
        "current": current_data,
        "daily": daily_data
    })
