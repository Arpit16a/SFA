import React, { useState } from 'react'
import {useDispatch, useSelector}   from 'react-redux'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {adminLogin} from '../../redux/actions/authActions.js'



function LoginRegister({
    click,
    className,
    data={}
}) {
  const dispatch = useDispatch();
  const navigate= useNavigate()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

     // Handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const endpoint = isRegister ? '/auth/register' : '/auth/login';  // API endpoint
    const payload = { type: 'admin',username, password };  // Data to send

    try {
        const response = await axios.post(endpoint, payload);
        setMessage(response.data.message);
        dispatch(adminLogin(response.data))
        setTimeout(() => {
            navigate('/admin')
            click()
        }, 1000);
      } catch (err) {
        console.log(err);
        
        setError(err.response?.data?.error || 'Something went wrong.');
      }
    };
  
  
  

  return (
    <div>
      <div className={` fixed  top-0 left-0 z-[10] h-full w-full flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-60 ${className}`}>
      <div onClick={click} className=' absolute left-0 top-0 w-full h-full z-[11]'></div>
        <div className="form   z-[12] rounded-xl p-4 flex  bg-white md:w-[30%]">
            {/* content starts here */}
            <div className='flex-col w-full'>
      <h2 className='m-auto text-3xl font-bold'>{isRegister ? 'Register' : 'Login'}</h2>
      
      <form onSubmit={handleSubmit} className='text-black  text-lg flex-col justify-center items-center px-6'>
        <div className='m-auto flex  justify-between items-center my-4'>
          <label >Username:</label>
          <input
            type="text"
            value={username}
            className='border-green-400 border-2 rounded-md p-1'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className='m-auto flex  justify-between items-center'>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            className='border-green-400 border-2 rounded-md p-1'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className='flex w-full m-auto' style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <button className='m-auto flex  justify-center items-center w-full py-1 rounded-md border-green-700 bg-green-500 border-2 text-white my-3' type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button className='bg-transparent text-black text-center m-auto' onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </button>
    </div>
        </div>
      </div>
     
    </div>
  )
}

export default LoginRegister
