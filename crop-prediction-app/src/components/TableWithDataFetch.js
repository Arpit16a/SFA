import "./TableWithDataFetch.css"
import {useDispatch, useSelector}   from 'react-redux'
import {getItems, addItem, updateItem, deleteItem} from '../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import UpdateRequestDialog from '../components/Dialog/UpdateRequestDialog.js'

const TableWithDataFetch = ({isActionVisible=false}) => {
  const [dialogStatus, setDialogStatus] = useState({status: false})
  const [data, setData]= useState({})
  const dispatch = useDispatch();
  const {items, loading} =useSelector((state)=> state.items)

  useEffect(()=> {
    dispatch(getItems())
  }, [dispatch])


  const handleDelete = (id) =>{
    dispatch(deleteItem(id))
    toast.success('Request deleted successfully!')
  }

  return (
    <>
    <div className="table-container">
    <h1>Surplus and Shortage Requests</h1>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Partners</th>
            <th>Supply</th>
            <th>State</th>
            <th>Crop</th>
            <th>Date</th>
            <th>Contact</th>
            {isActionVisible?
            <th>Action</th>
            : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.partners}</td>
              <td>{item.supply}</td>
              <td>{item.state}</td>
              <td>{item.crop}</td>
              <td>{item.date}</td>
              <td>{item.contact}</td>
             {isActionVisible?  <td className="gap-2 flex m-auto items-center justify-center">
                <button onClick={(e)=>{ 
                  e.preventDefault();
                  setDialogStatus({status: !dialogStatus.status,
                })

                setData(item)

                }} className="bg-gray-500 py-1 px-2 rounded-md text-white">Update</button>
              <button onClick={()=> handleDelete(item.id)} className="bg-red-500 py-1 px-2 rounded-md text-white">Delete</button></td> : null}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <ToastContainer/> */}
    </div>

    <ToastContainer 
            position='top-right'  
            autoClose={1000} 
            hideProgressBar={false}
            newestOnTop={false}            
            closeOnClick                   
            rtl={false}               
            draggable                      
            pauseOnHover                   
            theme="colored" /> 

<UpdateRequestDialog click={()=>{
            setDialogStatus(!dialogStatus.status)
            }} data={data} className={`${dialogStatus.status? 'block':'hidden'}`}
            setData={setData}
            />
    </>
  );
};

export default TableWithDataFetch;