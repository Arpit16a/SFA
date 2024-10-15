import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="weather-app w-full flex flex-col px-10">
      <h1 className='m-auto font-bold text-3xl text-green-400'>Weather Forecast</h1>
      
      {weatherData && (
        <div className='w-full flex space-x-8 justify-center items-center'>
          <div className="current-weather my-4 w-1/2">
            <h1 className='text-xl font-bold text-green-400'>Current Weather:</h1>
            <div className='pl-2'>
            <p><span className='font-semibold'>Temperature:</span> {weatherData.current.temperature}°C</p>
            <p><span className='font-semibold'>Humidity:</span> {weatherData.current.humidity}%</p>
            <p><span className='font-semibold'>Precipitation:</span> {weatherData.current.precipitation} mm</p>
            <p><span className='font-semibold'>Cloud Cover:</span> {weatherData.current.cloud_cover}%</p>
            <p><span className='font-semibold'>Location:</span> Kanpur</p>
            </div>
          </div>

          <div className="forecast w-1/2">
            <h2 className='font-bold text-xl mt-4 '>7-Day Forecast</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weatherData.daily.date.map((date, index) => ({
                date,
                maxTemp: weatherData.daily.max_temp[index],
                minTemp: weatherData.daily.min_temp[index],
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="maxTemp" stroke="#8884d8" name="Max Temp" />
                <Line type="monotone" dataKey="minTemp" stroke="#82ca9d" name="Min Temp" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;