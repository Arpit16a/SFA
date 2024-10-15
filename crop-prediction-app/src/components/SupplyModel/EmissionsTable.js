import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import io from 'socket.io-client';

const EmissionsTable = () => {
  const [emissions, setEmissions] = useState([]);

  useEffect(() => {
    const fetchEmissions = async () => {
      const response = await fetch('/emissions');
      const data = await response.json();
      setEmissions(data);
    };

    fetchEmissions();

    const socket = io();
    socket.on('emissions_update', (updatedEmissions) => {
      setEmissions(updatedEmissions);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Paper elevation={3} className="p-5 mt-5">
      <Typography variant="h5" className="mb-3">Emissions Data</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Distance (km)</TableCell>
            <TableCell>Truck Type</TableCell>
            <TableCell>Emission (kg CO2)</TableCell>
            <TableCell>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emissions.map((emission, index) => (
            <TableRow key={index}>
              <TableCell>{emission.DATE}</TableCell>
              <TableCell>{emission.FROM}</TableCell>
              <TableCell>{emission.TO}</TableCell>
              <TableCell>{emission.DISTANCE}</TableCell>
              <TableCell>{emission.TRUCK}</TableCell>
              <TableCell>{emission.EMISSION.toFixed(2)}</TableCell>
              <TableCell>${emission.COST.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default EmissionsTable;