import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector}   from 'react-redux'
import {getItems, addItem, updateItem, deleteItem} from '../../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';
import { FaInfo } from 'react-icons/fa6';
import { data } from '@tensorflow/tfjs';
import 'react-toastify/dist/ReactToastify.css';

function UpdateRequestDialog({
    click,
    className,
    data={},
    setData
},) {
  const dispatch = useDispatch();

  const [newData, setNewData] = useState({})
  
  useEffect(()=> setNewData(data), [data])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ( {...prev,[name]: value}));
  };

  const handleUpdate =()=> {
    if(newData.partners =='' || newData.contact=='' || newData.crop=='' || newData.date == '' || newData.state=='' || newData.supply =='' ) {
      toast.error('Kindly fill all the fields before submit!')
      return
    }
      dispatch(updateItem(newData.id, newData));
      click()
      toast.success('Request updated successfully! ')
  }
  
  return (
    <div>
      
      <div className={`outer fixed  top-0 left-0 z-[10] h-full w-full flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-60 ${className}`}>
      <div onClick={click} className=' absolute left-0 top-0 w-full h-full z-[11]'></div>
        <div className="form   z-[12] rounded-xl p-4 flex  bg-white md:w-[30%]">
            <div className="items z-[11] w-full gap-5 m-auto flex flex-col items-center ">
                <h1 className=' capitalize text-3xl text-black font-bold'>Update Request</h1>
                <p className='justify-center flex text-center'>Kindly fill all the fields before submitting</p>


                <div>
      <div className="flex flex-col w-full justify-center p items-center gap-4 p-5 flex-wrap text-nowrap">
<div className='w-full flex justify-between items-center gap-3'>
<label className='w-1/5' htmlFor="partners">Partners:</label>
<select value={newData.partners }       onChange={handleChange} className='bg-gray-200 w-3/5' disabled name="partners" id="partners" >
    <option value="Farmer">Farmer</option>
    <option value="Supplier">Supplier</option>
  </select>
  </div>

  <div className='w-full flex justify-between items-center gap-3'>
  <labe className='w-1/5' l htmlFor="supply">Supply:</labe>
    <select className=' w-3/5' value={newData.supply} onChange={handleChange}   name="supply" id="supply">
      <option disabled className='text-gray-400' value="">Select</option>
    <option value="Surplus">Surplus</option>
    <option value="Shortage">Shortage</option>
  </select>
  </div>

  <div className='w-full flex justify-between items-center gap-3'>
  <label className='w-1/5'  htmlFor="state">State:</label>
  <select className=' w-3/5'  name="state" id="state" value={newData.state} onChange={handleChange}>
  <option disabled value="" >Select</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chattisgarh">Chattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
  </select>
  </div>

  <div className='w-full flex justify-between items-center gap-3'>
  <label className='w-1/5'  htmlFor="crop">Crop:</label>
    <select className=' w-3/5'  name="crop" id="crop" value={newData.crop} onChange={handleChange}>
    <option disabled value="" >Select</option>
    <option value="Wheat">Wheat</option>
    <option value="Rice">Rice</option>
    <option value="Corn">Corn</option>
    <option value="Millet">Millet</option>
    <option value="Sorghum">Sorghum</option>
    <option value="Barley">Barley</option>
  </select>
  </div>
  <div className='w-full flex justify-between items-center gap-3'>
      <label className='w-1/5' htmlFor="date">Date:</label>
       <input id='date' value={newData.date} disabled className='px-3  w-3/5 py-2 bg-gray-200 border-green-400 border-2 rounded-lg' type="text"  />
    </div>
  <div className='w-full flex justify-between items-center gap-3'>
    <label className='w-1/5'  htmlFor="contact">Contact:</label>
  <input name='contact' value={newData.contact} onChange={handleChange} className='px-3 py-2  w-3/5 border-green-400 border-2 rounded-lg' type="text"  placeholder='Contact Number'/>
  </div>
 
        </div>
       
        <button onClick={handleUpdate} className='hover:bg-green-600 w-full py-2 text-center bg-green-400 border-green-500 border-2 rounded-md text-white font-bold'>Update</button>

        </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateRequestDialog
