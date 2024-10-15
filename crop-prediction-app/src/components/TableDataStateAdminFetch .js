import "./TableWithDataFetch.css"
import {useDispatch, useSelector}   from 'react-redux'
import {getItems, addItem, updateItem, deleteItem} from '../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const TableDataStateAdminFetch  = () => {
  const dispatch = useDispatch();
  const {items, loading} =useSelector((state)=> state.items)

  useEffect(()=> {
    dispatch(getItems())
  }, [dispatch])

  return (
    <>
    <div className="table-container">
    <h1>Surplus Requests</h1>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Partners</th>
            <th>Supply</th>
            <th>State</th>
            <th>Crop</th>
            <th>Date</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => 
           item.supply == 'Surplus' && (
              <tr key={item.id}>
              <td>{item.partners}</td>
              <td>{item.supply}</td>
              <td>{item.state}</td>
              <td>{item.crop}</td>
              <td>{item.date}</td>
              <td>{item.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="table-container">
    <h1>Shortage Requests</h1>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Partners</th>
            <th>Shortage</th>
            <th>State</th>
            <th>Crop</th>
            <th>Date</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => 
            item.supply == 'Shortage' && (
            <tr key={item.id}>
              <td>{item.partners}</td>
              <td>{item.supply}</td>
              <td>{item.state}</td>
              <td>{item.crop}</td>
              <td>{item.date}</td>
              <td>{item.contact}</td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default TableDataStateAdminFetch ;