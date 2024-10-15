import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import io from 'socket.io-client';

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io();
    
    const fetchInventory = async () => {
      try {
        const response = await fetch('/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    socket.on('inventory_update', (updatedInventory) => {
      setInventory(updatedInventory);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Inventory Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>State</TableCell>
            <TableCell>Crop</TableCell>
            <TableCell align="right">Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.STATE}</TableCell>
              <TableCell>{item.CROP}</TableCell>
              <TableCell align="right">{item.STOCK}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default InventoryManagement;