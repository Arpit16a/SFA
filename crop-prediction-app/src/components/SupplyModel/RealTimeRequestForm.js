import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableHead, TableRow, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import io from 'socket.io-client';

function RealTimeRequestForm({userState=''}) {
  const [state, setState] = useState(userState);
  const [crop, setCrop] = useState('');
  const [type, setType] = useState('Shortage');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizedRoutes, setOptimizedRoutes] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [truckTypes, setTruckTypes] = useState({});

  useEffect(() => {
    const socket = io();
    socket.on('past_requests_update', (updatedRequests) => {
      setRecentRequests(updatedRequests.slice(0, 5));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/realtime-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, crop, type, quantity: Number(quantity) }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      setMessage(data.message);
      setOptimizedRoutes(data.optimizedRoutes);
      
      // Initialize truck types for new routes
      const initialTruckTypes = {};
      data.optimizedRoutes.forEach((route, index) => {
        initialTruckTypes[index] = 'DIESEL';
      });
      setTruckTypes(initialTruckTypes);

      // Fetch distances for each route
      const updatedRoutes = await Promise.all(data.optimizedRoutes.map(async (route) => {
        const distance = await fetchDistance(route.from, route.to);
        return { ...route, distance };
      }));
      setOptimizedRoutes(updatedRoutes);
    } catch (error) {
      console.log(error);
      setMessage('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistance = async (from, to) => {
    try {
      const response = await fetch(`/get-distance?from=${from}&to=${to}`);
      if (!response.ok) {
        throw new Error('Failed to fetch distance');
      }
      const data = await response.json();
      return data.distance;
    } catch (error) {
      console.error('Error fetching distance:', error);
      return null;
    }
  };

  const handleTruckTypeChange = (index, value) => {
    setTruckTypes(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const calculateEmission = (distance, quantity, truckType) => {
    if (truckType === 'DIESEL' && distance && quantity) {
      const numTrucks = Math.ceil(quantity / 25);
      return ((2.6444 / 3.33) * distance * numTrucks).toFixed(2);
    }
    return 'N/A';
  };

  const handleSendReceive = async (route, action, index) => {
    try {
      const response = await fetch('/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          route, 
          action,
          truckType: truckTypes[index]
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }
      const data = await response.json();
      alert(data.message);
      // Refresh optimized routes after action
      setOptimizedRoutes(prevRoutes => prevRoutes.filter((_, i) => i !== index));
    } catch (error) {
      alert('Error processing request: ' + error.message);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Real-time Request</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          fullWidth
          margin="normal"
          disabled
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Crop</InputLabel>
          <Select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            required
          >
            <MenuItem value="Wheat">Wheat</MenuItem>
            <MenuItem value="Rice">Rice</MenuItem>
            <MenuItem value="Maize">Maize</MenuItem>
            <MenuItem value="Onion">Onion</MenuItem>
            <MenuItem value="Potato">Potato</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <MenuItem value="Shortage">Shortage</MenuItem>
            <MenuItem value="Surplus">Surplus</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit Request'}
        </Button>
      </form>
      {message && (
        <Alert severity={message.includes('error') ? 'error' : 'success'} style={{ marginTop: '1rem' }}>
          {message}
        </Alert>
      )}
      {optimizedRoutes && optimizedRoutes.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <Typography variant="h6">Optimized Routes</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Truck Type</TableCell>
                <TableCell>Emission</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {optimizedRoutes.map((route, index) => (
                <TableRow key={index}>
                  <TableCell>{route.from}</TableCell>
                  <TableCell>{route.to}</TableCell>
                  <TableCell>{route.quantity}</TableCell>
                  <TableCell>${route.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={truckTypes[index]}
                      onChange={(e) => handleTruckTypeChange(index, e.target.value)}
                    >
                      <FormControlLabel value="DIESEL" control={<Radio />} label="Diesel" />
                      <FormControlLabel value="EV" control={<Radio />} label="EV" />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    {truckTypes[index] === 'DIESEL' ? 
                      `${calculateEmission(route.distance, route.quantity, 'DIESEL')} kg CO2` : 
                      <div>
                        <p>24.5% Fuel Cost Saving than Diesel truck</p>
                        <p>No Pipeline Emission</p>
                      </div>
                    }
                  </TableCell>
                  {/* <TableCell>
                    <Button 
                      onClick={() => handleSendReceive(route, 'send', index)} 
                      variant="contained" 
                      color="primary"
                      style={{marginRight: '5px'}}
                    >
                      Send
                    </Button>
                    <Button 
                      onClick={() => handleSendReceive(route, 'receive', index)} 
                      variant="contained" 
                      color="secondary"
                    >
                      Receive
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <Typography variant="h6">Recent Requests</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Crop</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentRequests.map((request, index) => (
              <TableRow key={index}>
                <TableCell>{request.Date}</TableCell>
                <TableCell>{request.State}</TableCell>
                <TableCell>{request.Crop}</TableCell>
                <TableCell>{request.Type}</TableCell>
                <TableCell>{request.Quantity}</TableCell>
                <TableCell>{request.Status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

export default RealTimeRequestForm;