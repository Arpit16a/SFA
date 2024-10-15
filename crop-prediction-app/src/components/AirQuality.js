import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AirQualityApp = () => {
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Kanpur');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchAirQualityData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/air-quality?city=${selectedCity}`);
        if (!response.ok) {
          throw new Error('Failed to fetch air quality data');
        }
        const data = await response.json();
        setAirQualityData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAirQualityData();
  }, [selectedCity]);

  if (loading) return <div className='px-10 m-auto'>Loading air quality data...</div>;
  if (error) return <div className='px-10 m-auto'>Error: {error}</div>;

  return (
    <div className="air-quality-app px-10 py-8">
      <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-semibold text-green-400'>Air Quality Information</h1>
      
      <div className="city-selector">
        <label htmlFor="city-select">Select a city: </label>
        <select
        className='border-green-400'
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      </div>
      {airQualityData && (
        <div className='flex space-x-8 w-full justify-center items-center'>
          <div className="current-air-quality py-5 w-1/2">
            <h1 className='text-lg font-semibold text-green-400'>Current Air Quality in {airQualityData.city}</h1>
            <p>Time: {new Date(airQualityData.current.time).toLocaleString()}</p>
            <p>PM10: {airQualityData.current.pm10} µg/m³</p>
            <p>PM2.5: {airQualityData.current.pm2_5} µg/m³</p>
            <p>Carbon Monoxide: {airQualityData.current.carbon_monoxide} µg/m³</p>
            <p>UV Index: {airQualityData.current.uv_index}</p>
            <p>UV Index (Clear Sky): {airQualityData.current.uv_index_clear_sky}</p>
          </div>
          
          <div className="hourly-forecast w-1/2">
            <h2 className='font-semibold text-lg my-5'>Hourly Forecast</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={airQualityData.hourly.time.map((time, index) => ({
                time: new Date(time).toLocaleTimeString(),
                pm10: airQualityData.hourly.pm10[index],
                pm2_5: airQualityData.hourly.pm2_5[index],
                uv_index: airQualityData.hourly.uv_index[index],
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="pm10" stroke="#8884d8" name="PM10 (µg/m³)" />
                <Line yAxisId="left" type="monotone" dataKey="pm2_5" stroke="#82ca9d" name="PM2.5 (µg/m³)" />
                <Line yAxisId="right" type="monotone" dataKey="uv_index" stroke="#ffc658" name="UV Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirQualityApp;