import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const CropPrediction = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [serverInfo, setServerInfo] = useState('');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setServerStatus('Online');
      setServerInfo(response.data);
    } catch (error) {
      setServerStatus('Offline');
      console.error('Server status check failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPredictions([]);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      if (response.data.status === 'success') {
        setPredictions(response.data.predictions);
      } else {
        setError(response.data.error || 'An unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || error.message || 'An error occurred while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crop Prediction System</h1>
      <p className="mb-4">Server Status: <span className={serverStatus === 'Online' ? 'text-green-600' : 'text-red-600'}>{serverStatus}</span></p>
      {serverInfo && <p className="mb-4">Server Info: {serverInfo}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading || serverStatus !== 'Online'}
        >
          {isLoading ? 'Predicting...' : 'Predict Crops'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      {predictions.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Top Predicted Crops:</h2>
          <ul className="list-disc pl-5">
            {predictions.map((pred, index) => (
              <li key={index} className="text-lg">
                {pred.crop}: {(pred.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CropPrediction;