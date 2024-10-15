import React, { useState } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText, Paper, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function PredictionForm() {
  const [state, setState] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/predict-supply', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      if (!response.ok) {
        throw new Error('Prediction failed');
      }
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Prediction</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <FormControl fullWidth margin="normal">
          <InputLabel>State</InputLabel>
          <Select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
            <MenuItem value="Maharastra">Maharastra</MenuItem>
            <MenuItem value="Punjab">Punjab</MenuItem>
            <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
            <MenuItem value="Rajasthan">Rajasthan</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Predict'}
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
      {predictions.length > 0 && (
        <List>
          {predictions.map((prediction, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={prediction.crop} 
                secondary={`Prediction: ${prediction.prediction}`} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default PredictionForm;