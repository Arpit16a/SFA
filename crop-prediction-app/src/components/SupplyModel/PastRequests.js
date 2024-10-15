import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import io from 'socket.io-client';

function PastRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/past-requests');
        if (!response.ok) {
          throw new Error('Failed to fetch past requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Set up Socket.IO connection
    const socket = io();
    socket.on('past_requests_update', (updatedRequests) => {
      setRequests(updatedRequests);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Past Requests</Typography>
      {requests.length === 0 ? (
        <Typography>No past requests found.</Typography>
      ) : (
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
            {requests.map((request, index) => (
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
      )}
    </Paper>
  );
}

export default PastRequests;