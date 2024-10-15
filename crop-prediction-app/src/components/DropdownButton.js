import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {FaAngleDown, FaCross, FaXmark} from 'react-icons/fa6'
import {Menu, MenuHandler, MenuList, MenuItem, Button} from '@material-tailwind/react'
import {  ChevronUpIcon } from "@heroicons/react/24/solid";
import { Transition } from '@headlessui/react';
import { useParams, useNavigate } from 'react-router-dom';
import LoginRegister from './Dialog/LoginRegister';
import { useDispatch, useSelector } from 'react-redux'
import {logout, farmerLogin, supplierLogin, stateadminLogin} from '../redux/actions/authActions.js'
import axios from 'axios';
import { FaBackspace, FaBackward } from 'react-icons/fa';


function DropdownButton({classname}) {
    const navigate = useNavigate();

    const {adminAuthStatus, farmerAuthStatus, supplierAuthStatus, stateadminAuthStatus} = useSelector((state)=> state.auth)
    

    const [signD, setSignD]= useState(false)
    const [state, setState] = useState('');

    const [open, setOpen] = useState(false);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [nestedStateOpen, setNestedStateOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState({
      status:false,
      type:'',
      name:'',
      contact: '',
      state:'',
      address:'',
      username:'',
      password:''
    });
    const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
  
    const handleClick= ()=>{
       setOpen(false)
       setNestedOpen(false)
       setNestedStateOpen(false)
    }

    const handleCloseDialog = () => {
      setIsDialogOpen({status:false,
        type:'',
        name:'',
        contact: '',
        state:'',
        address:'',
        username:'',
        password:''});
    };

      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const endpoint = isRegister ? '/auth/register' : '/auth/login';  // API endpoint
        const payload = {...isDialogOpen};  // Data to send
    
        try {
            const response = await axios.post(endpoint, payload);

            setMessage(response.data.message);
            console.log(response.data);
            
            switch(isDialogOpen.type){
              case 'farmer':
                dispatch(farmerLogin(response.data))
                break
              case 'supplier':
                dispatch(supplierLogin(response.data))
                break
              case 'state-admin':
                dispatch(stateadminLogin(response.data))
                break
            }
            
            setTimeout(() => {
                navigate(`/${isDialogOpen.type}`)
                handleCloseDialog()
            }, 1000);
          } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
          }
        };
      
      

  return (
    // className='relative flex flex-col items-center justify-center rounded-lg'
    <div className={`relative text-left z-10  ${classname}`} >

        {/* Main Button */}
      <button
        className="inline-flex justify-center w-full rounded-lg  shadow-sm px-4 py-2 bg-green-400 text-md  text-white font-semibold hover:bg-gray-100 focus:outline-none transition-all duration-200 ease-in-out"
        onClick={() => setOpen(!open)}
      >
        Login
       
      </button>

      {/* Dropdown Menu */}
      <Transition
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 transform scale-95"
        enterTo="opacity-100 transform scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 transform scale-100"
        leaveTo="opacity-0 transform scale-95"
      >
        <div className="md:origin-top-right origin-top-left absolute md:right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <span className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg' onClick={()=>{
                if(farmerAuthStatus){
                  navigate('/farmer')
                }else{
                  setIsDialogOpen({...isDialogOpen, status:true, type:'farmer'})
                }
                handleClick()
              } }>Farmer</span>
            
            
            {/* Nested Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setNestedOpen(!nestedOpen)}
                className="w-full text-left  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between rounded-lg"
              >
                Moderator
                <svg
                  className="h-5 w-5 transition-transform duration-300 rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Nested Menu */}
              <Transition
                show={nestedOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 transform scale-95"
                enterTo="opacity-100 transform scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 transform scale-100"
                leaveTo="opacity-0 transform scale-95"
              >
                <div className="absolute right-full top-0 mt-0 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">

                    {/* supplier */}
                    <div  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg' onClick={()=>{
                    if(supplierAuthStatus){
                      navigate('/supplier')
                      console.log(supplierAuthStatus);
                      
                    }else{
                    setIsDialogOpen({...isDialogOpen, status:true, type:'supplier'})
                    }
                    handleClick()
                    } }>
                      Supplier
                    </div>
                    <div   className="relative w-full inline-block text-left z-10">
                    <div
                 className='w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg' onClick={()=>{
                  if(stateadminAuthStatus){
                    navigate('/state-admin')
                    console.log(stateadminAuthStatus);
                    
                  }else{
                    setIsDialogOpen({...isDialogOpen, status:true, type:'state-admin'})
                  }
                  handleClick()
                } }
              >
                      State Admin
                      </div>
                     
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <div onClick={() => {
              setOpen(!open)
              if(adminAuthStatus){
                navigate('/admin')
              }else{
                setSignD((prev)=> !prev)
              }
              
              }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              Admin
            </div>

          </div>
        </div>
      </Transition>
      
      <LoginRegister click={()=>{
            setSignD(!signD)
            }} className={`${signD? 'block':'hidden'}`} />

             {/* Confirmation Dialog */}
      {isDialogOpen.status && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  w-full ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <div className='flex-col w-full'>
            <FaXmark onClick={handleCloseDialog} className='text-2xl hover:scale-[0.9] cursor-pointer text-gray-500'/>
      <h2 className='m-auto text-3xl font-bold capitalize'>{isDialogOpen.type} { isRegister ? 'Register' : 'Login'}</h2>
      
      <form onSubmit={handleSubmit} className='text-black  text-lg flex-col justify-center items-center px-6'>

        {isRegister && (
          <div className='m-auto flex w-full  grid-cols-2 justify-between items-center my-4 text-justify'>
          <label >Name:</label>
          <input
            type="text"
            value={isDialogOpen.name}
            className='border-green-400 border-2 rounded-md p-1 w-3/5'
            onChange={(e) => setIsDialogOpen({...isDialogOpen,name: e.target.value})}
            required
          />
        </div>
        )}

         {isRegister && (
          <div className='m-auto grid-cols-2 flex w-full justify-between items-center my-4 text-justify'>
          <label >Address:</label>
          <input
            type="text"
            value={isDialogOpen.address}
            className='border-green-400 border-2 rounded-md p-1 w-3/5'
            onChange={(e) => setIsDialogOpen({...isDialogOpen,address: e.target.value})}
            required
          />
        </div>
        )}

          {isRegister && (
          <div className='grid-cols-2 m-auto flex w-full justify-between items-center my-4 text-justify'>
          <label >Contact:</label>
          <input
            type="text"
            value={isDialogOpen.contact}
            className='border-green-400 border-2 rounded-md p-1 w-3/5'
            onChange={(e) => setIsDialogOpen({...isDialogOpen,contact: e.target.value})}
            required
          />
        </div>
        )}

        {isRegister && (
          <div className='m-auto flex w-full justify-between items-center my-4 text-justify grid-cols-2 gap-3'>
          <label >State:</label>
         
              <select className='w-3/5 border-green-400 border-2'  name="state" id="state" value={isDialogOpen.state} onChange={(e)=> { setIsDialogOpen({...isDialogOpen,state: e.target.value, username: isDialogOpen.type+ "_"+ e.target.value} )
              }} required>
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
        )}
        {isRegister && (
        <div className='m-auto flex w-full justify-between items-center my-4 text-justify grid-cols-2'>
          <label >Username:</label>
          <input
            type="text"
            disabled={isDialogOpen.type=='state-admin' || isDialogOpen.type=='supplier'? true: false}
            value={isDialogOpen.type=='state-admin' || isDialogOpen.type=='supplier' ? `${isDialogOpen.type}_${isDialogOpen.state}`: isDialogOpen.username}
            className={`border-green-400 border-2 rounded-md p-1 w-3/5 ${isDialogOpen.type=='state-admin' || isDialogOpen.type=='supplier'? 'bg-gray-300': null}`}            required
          />
        </div>)}
        {!isRegister && (
        <div className='m-auto flex w-full justify-between items-center my-4 text-justify grid-cols-2'>
          <label >Username:</label>
          <input
            type="text"
            value={isDialogOpen.username}
            className={`border-green-400 border-2 rounded-md p-1 w-3/5`}
            onChange={(e) => setIsDialogOpen({...isDialogOpen,username: e.target.value})}
            required
          />
        </div>)}

        <div className='m-auto flex  justify-between items-center text-justify grid-cols-2'>
          <label>Password:</label>
          <input
            type="password"
            value={isDialogOpen.password}
            className='border-green-400 border-2 rounded-md w-3/5 p-1'
            onChange={(e) => setIsDialogOpen({...isDialogOpen,password: e.target.value})}
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
      )}
    </div>
  )
}

export default DropdownButton
