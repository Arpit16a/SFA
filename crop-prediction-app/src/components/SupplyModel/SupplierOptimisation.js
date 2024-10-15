import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import io from 'socket.io-client';

function SupplierOptimisation({state='Maharastra'}) {
  const [optimizedRoutes, setOptimizedRoutes] = useState({});
  const [incompleteRequests, setIncompleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [truckTypes, setTruckTypes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/optimize-all-routes');
        if (!response.ok) {
          throw new Error('Failed to fetch optimization data');
        }
        const data = await response.json();
        
        // Fetch distances for each route
        const updatedOptimizedRoutes = {};
        for (const [crop, routes] of Object.entries(data.optimizedRoutes)) {
          updatedOptimizedRoutes[crop] = {
            ...routes,
            redistribution: await Promise.all(routes.redistribution.map(async (route) => {
              const distanceResponse = await fetch(`/get-distance?from=${route.from}&to=${route.to}`);
              const distanceData = await distanceResponse.json();
              return { ...route, distance: distanceData.distance };
            }))
          };
        }
        
        setOptimizedRoutes(updatedOptimizedRoutes);
        setIncompleteRequests(data.incompleteRequests);
        

        // Initialize truck types
        const initialTruckTypes = {};
        Object.keys(updatedOptimizedRoutes).forEach(crop => {
          updatedOptimizedRoutes[crop].redistribution.forEach((route, index) => {
            initialTruckTypes[`${crop}-${index}`] = 'DIESEL';
          });
        });
        setTruckTypes(initialTruckTypes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = io();
    socket.on('optimization_update', (updatedData) => {
      setOptimizedRoutes(updatedData.optimizedRoutes);
      setIncompleteRequests(updatedData.incompleteRequests);
    });

    return () => {
      socket.disconnect();
    };
  }, [loading]);

  const handleTruckTypeChange = (crop, index, value) => {
    setTruckTypes(prev => ({
      ...prev,
      [`${crop}-${index}`]: value
    }));
  };

  const calculateEmission = (distance, quantity, truckType) => {
    if (truckType === 'DIESEL' && distance && quantity) {
      const numTrucks = Math.ceil(quantity / 25);
      return ((2.6444 / 3.33) * distance * numTrucks).toFixed(2);
    }
    return 0;
  };

  const handleSendReceive = async (requestId, route, action, crop, index) => {
    setLoading(true)
    try {
      const response = await fetch('/accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          requestId, 
          route, 
          truckType: truckTypes[`${crop}-${index}`]
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error processing request: ' + error.message);
    } finally{
      setLoading(false)
    }
  };

  const handleCropsSendReceive = async (requestId, route, action, crop, index) => {
    setLoading(true)
    try {
      const response = await fetch('/realtime-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: route.from, crop, type:  action=='send'? 'Surplus': 'Shortage', quantity:  Number(route.quantity) }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      alert('Request added successfully.');
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  const handleFarmerAcceptRequest = async (requestId) => {
    setLoading(true)
    try {
      const response = await fetch('/farmer-accept-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept request');
      }
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error accepting request: ' + error.message);
    } finally{
      setLoading(false)
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Optimized Routes by Crop</Typography>
      
      <Typography variant="h5" gutterBottom style={{marginTop: '20px'}}>Real-time Requests</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Crop</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Routes</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Truck Type</TableCell>
            <TableCell>Emission</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incompleteRequests.map((req, index) => 
          req.from != 'Farmer' && req.State==state ? (
            <TableRow key={index}>
              <TableCell>{req.Crop}</TableCell>
              <TableCell>{req.State}</TableCell>
              <TableCell>{req.Type}</TableCell>
              <TableCell>{req.Quantity}</TableCell>
              <TableCell>
                {Array.isArray(req.OptimizedRoutes) ? req.OptimizedRoutes.map((route, routeIndex) => (
                  <div key={routeIndex}>
                    From: {route.from}, To: {route.to}, Quantity: {route.quantity}
                  </div>
                )) : 'No routes available'}
              </TableCell>
              <TableCell> 
                {Array.isArray(req.OptimizedRoutes) ? req.OptimizedRoutes.map((route, routeIndex) => (
                  <div key={routeIndex}>
                ${route.cost.toFixed(2)}
                </div>)) : null}</TableCell>
              <TableCell>
                <RadioGroup
                  row
                  value={truckTypes[`${req.Crop}-${index}`]}
                  onChange={(e) => handleTruckTypeChange(req.Crop, index, e.target.value)}
                >
                  <FormControlLabel value="DIESEL" control={<Radio />} label="Diesel" />
                  <FormControlLabel value="EV" control={<Radio />} label="EV" />
                </RadioGroup>
              </TableCell>
              <TableCell>
              {Array.isArray(req.OptimizedRoutes) ? req.OptimizedRoutes.map((route, routeIndex) => (
                  <div key={routeIndex}>
                {truckTypes[`${req.Crop}-${index}`] === 'DIESEL' ? 
                  `${calculateEmission(optimizedRoutes[req.Crop].redistribution.find(item=> item.from == req.State).distance, req.Quantity, 'DIESEL')} kg CO2` : 
                  <div>
                    <p>24.5% Fuel Cost Saving than Diesel truck</p>
                    <p>No Pipeline Emission</p>
                  </div>
                }
                 </div>)) : null}
              </TableCell>
              <TableCell>
                {Array.isArray(req.OptimizedRoutes) && req.OptimizedRoutes.map((route, routeIndex) => (
                  <div key={routeIndex}>
                    {req.Type=='Surplus' && (<Button 
                    className={`${req.Type=='Surplus'? 'block': 'hidden'}`}
                      onClick={() => handleSendReceive(req.id, route, 'send', req.Crop, index)} 
                      variant="contained" 
                      color="primary"
                      style={{marginRight: '5px'}}
                    >
                      Send
                    </Button>)}
                    {req.Type=='Shortage' && (<Button 
                      onClick={() => handleSendReceive(req.id, route, 'receive', req.Crop, index)} 
                      variant="contained" 
                      color="secondary"
                      style={{marginRight: '5px'}}
                    >
                      Receive
                    </Button>)}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ): null)}
        </TableBody>
      </Table>

      <Typography variant="h5" gutterBottom style={{marginTop: '20px'}}>Farmer</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Crop</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
       <TableBody>
          {incompleteRequests.map((req, index) => 
          req.from=='Farmer' && req.State==state? (
              <TableRow key={index}>
              <TableCell>{req.Crop}</TableCell>
              <TableCell>{req.from}</TableCell>
              <TableCell>{req.State}</TableCell>
              <TableCell>{req.Type}</TableCell>
              <TableCell>{req.Quantity}</TableCell>
              <TableCell>
                <Button onClick={() => handleFarmerAcceptRequest(req.id)} variant="contained" color="primary">
                  {req.Type === 'Surplus' ? 'Send' : 'Receive'}
                </Button>
              </TableCell>
            </TableRow>
          ): null)}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SupplierOptimisation;