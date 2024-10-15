import React from 'react'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()
  return (
    <div>
      <footer className=' bg-[#1C1C1C] flex-col h-fit px-2 md:px-8'>
        <div className="grid-cols-none md:grid-cols-2 flex-none md:flex gap-0 md:gap-10">
          <div className="w-full md:w-1/3 px-2">
            <h3 className='font-bold text-md md:text-lg mb-5 text-center flex justify-center items-center gap-2 tracking-wider text-nowrap text-green-300'>Sustainable Food & Agriculture(SFA)</h3>
          
            <p className='text-center leading-5'>SFA platform provides various Artificial Intelligence and Machine Learning Models including various solutions to overcome challenges for a Sustainable Future and Cities.</p>
          </div>
          <div className='flex justify-between items-center w-full md:w-2/3 mt-4 md:mt-0'>
          <div onClick={()=> navigate('/about')} className=" cursor-pointer font-semibold  text-green-500">
            <h3>About Us</h3>
          </div>
          <div onClick={()=> navigate('/quicklinks')}  className="cursor-pointer font-semibold text-green-500">
            <h3>Quick Links</h3>
          </div>
          <div onClick={()=> navigate('/feedback')}  className="cursor-pointer font-semibold text-green-500">
            <h3>Feedback</h3>
          </div>
          <div   className="cursor-pointer font-semibold text-green-500">
           <a href={`mailto:abc@gmail.com?subject=Contact%20Us`}><h3>Contact Us</h3></a> 
          </div>
          </div>
        </div>
        
      </footer>

      <div onClick={()=> navigate('/')} className="font-semibold w-full py-2 text-center text-white bg-[#292828]">
          Copyright © 2024 SFA
        </div>
      </div>
  )
}

export default Footer
