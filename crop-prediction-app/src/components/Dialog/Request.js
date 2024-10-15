import React from 'react'
import {useDispatch, useSelector}   from 'react-redux'
import {getItems, addItem, updateItem, deleteItem} from '../../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';

function Request({
    click,
    className,
    data={}
}) {
  const dispatch = useDispatch();

  

  return (
    <div>
       
      <div className={`outer fixed  top-0 left-0 z-[10] h-full w-full flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-60 ${className}`}>
      <div onClick={click} className=' absolute left-0 top-0 w-full h-full z-[11]'></div>
        <div className="form   z-[12] rounded-xl p-4 flex  bg-white md:w-[30%]">
            <div className="items z-[11] w-full gap-5 m-auto flex flex-col items-center ">
                <h1 className=' capitalize text-3xl text-black font-bold'>Request Sent Successfully</h1>
                <p className='justify-center flex text-center'>Your Request was sent to Admin and you’ll be connected soon by other State Admin and Supplier.</p>
                <button onClick={click} className='w-full py-2 text-center bg-green-400 border-green-500 border-2 rounded-md text-white font-bold'>Ok</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Request
