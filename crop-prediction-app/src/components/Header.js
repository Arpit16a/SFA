import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DropdownButton from './DropdownButton'
import { FaBars , FaXmark} from 'react-icons/fa6'
import {vendorLogin, consumerLogin} from '../redux/actions/authActions.js'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {vendorAuthStatus, consumerAuthStatus} = useSelector((state)=> state.auth)

  const [open, setOpen] = useState(false)
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
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
            case 'consumer':
              dispatch(consumerLogin(response.data))
              break
            case 'vendor':
              dispatch(vendorLogin(response.data))
              break
          }
          
          setTimeout(() => {
              navigate(`/marketplace`)
              handleCloseDialog()
          }, 1000);
        } catch (err) {
          setError(err.response?.data?.error || 'Something went wrong.');
        }
      };
  return (
    <div>
       <header className='px-3 bg-[#1C1C1C] relative z-[10] shadow-xl'>
        <div className=" flex justify-center items-center">
          <img className='w-[40px] md:w-[80px] scale-[1.5] ml-5 object-cover' src="./logo.png" alt="logo" />
          
        </div>
        <nav className='hidden  md:flex justify-center items-center'>
          <ul >
              {[{name:'Home', route:'/'}, {name:'About', route:'/about'}, {name:'What We Do', route:'/whatwedo'}].map((item) => (
                <Link to={item.route}>
              <li key={item.name}>{item.name}</li></Link>
            ))}
             
             <li className='cursor-pointer' onClick={()=>{

              console.log(vendorAuthStatus, consumerAuthStatus);
              
                    if(vendorAuthStatus || consumerAuthStatus){
                      navigate('/marketplace')
                      setIsDialogOpen({...isDialogOpen, status:false,})
                    }else{
                    setIsDialogOpen({...isDialogOpen, status:true,})
                    }
                    
                    } } >Marketplace</li>
          </ul>
          
        </nav>

      
        
        <DropdownButton classname='hidden md:inline-block'/>
        <FaBars onClick={()=> setOpen((prev)=>!prev)} className='text-white text-2xl block md:hidden'/>
      </header>

      <nav className={`flex-col md:hidden absolute transition-all duration-200 ${open? 'top-[50px] left-0 ' : 'top-[-200px]'} w-full justify-center items-center  z-[5] text-white rounded-b-lg `}>
          <ul className='flex-col justify-center items-center bg-[#1C1C1C] rounded-b-lg w-full'>
              {[{name:'Home', route:'/'}, {name:'About', route:'/about'}, {name:'What We Do', route:'/whatwedo'},  {name:'Marketplace', route:'/marketplace'}].map((item) => (
                <Link to={item.route} onClick={()=> setOpen((prev)=> !prev)}>
              <li key={item.name}>{item.name}</li></Link>
            ))}
            <DropdownButton classname="md:hidden inline-block mb-4"/>
          </ul>
          
        </nav>

        {isDialogOpen.status && (
        <div className="fixed inset-0 flex items-center justify-center z-[11]  bg-black bg-opacity-50  w-full ">
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
         
              <select className='w-3/5 border-green-400 border-2'  name="state" id="state" value={isDialogOpen.state} onChange={(e)=> { setIsDialogOpen({...isDialogOpen,state: e.target.value})
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


          <div className='m-auto flex w-full justify-between items-center my-4 text-justify grid-cols-2 gap-3'>
          <label >Type:</label>
         
              <select className='w-3/5 border-green-400 border-2'  name="state" id="state" value={isDialogOpen.type} onChange={(e)=> { setIsDialogOpen({...isDialogOpen,type: e.target.value})
              }} required>
              <option disabled value="" >Select</option>
              <option value="consumer">Consumer</option>
              <option value="vendor">Vendor</option>
              
    </select>
        </div>
        
        <div className='m-auto flex w-full justify-between items-center my-4 text-justify grid-cols-2'>
          <label >Username:</label>
          <input
            type="text"
            value={isDialogOpen.username}
            className='border-green-400 border-2 rounded-md p-1 w-3/5'
            onChange={(e) => setIsDialogOpen({...isDialogOpen,username: e.target.value})}
            required
          />
        </div>

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

export default Header;
