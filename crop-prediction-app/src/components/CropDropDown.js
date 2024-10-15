import React from 'react'
import  { useState } from 'react'
import { Link } from 'react-router-dom';


function CropDropDown() {
    const [isOpen, setOpen]= useState(false);
    return (
    <div className='relative flex flex-col items-center justify-center rounded-lg'>
      <button onClick={()=>setOpen((prev)=> !prev) } 
      className='bg-blue-500 py-1 mt-4 px-8 rounded-md justify-center items-center flex border-4 border-transparent active:border-white duration-300 text-lg text-white font-semibold w-full text-center'>Crop Recommendation</button>

      {isOpen && <div className='absolute top-16 mt-2 z-[2] flex justify-center p-2 items-center bg-black bg-opacity-90 w-full rounded-lg '>
        <ul className='flex-col cursor-pointer flex justify-center w-full items-center'>
            <Link className='w-full' to='/simple-crop-recommendation'><li className='hover:bg-gray-300 text-white bg-opacity-60 w-full rounded-lg m-auto text-center'>Simple Model</li></Link>
            <Link className='w-full' to='/crop-recommendation'><li className='hover:bg-gray-300 text-white bg-opacity-60 w-full rounded-lg m-auto text-center'>Specific Crop Recommendation Model</li></Link>
            
        </ul>
        </div>}
    </div>
  )
}

export default CropDropDown