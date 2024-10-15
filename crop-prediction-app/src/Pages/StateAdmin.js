import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../components/DatePickerComponent';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {FaInfo} from 'react-icons/fa6'
import CropDropDown from '../components/CropDropDown';
import TableWithDataFetch from '../components/TableWithDataFetch';
import TableDataStateAdminFetch from '../components/TableDataStateAdminFetch ';
import { useDispatch, useSelector } from 'react-redux';
import {getItems, addItem, updateItem, deleteItem} from '../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OptimizationForm from '../components/SupplyModel/OptimizationForm.js';
import RealTimeRequestForm from '../components/SupplyModel/RealTimeRequestForm.js';


function StateAdmin() {
  const {stateName} = useParams()
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const navigate=useNavigate()
  const [todayDate, setTodayDate]= useState();
 
  const {userInfo, stateadminAuthStatus} = useSelector((state)=> state.auth)
  useEffect(()=> isToday(),[])

  const dispatch = useDispatch();
  const [data, setData] = useState({
    crop: "", 
    state: stateadminAuthStatus? userInfo.state: '',
    date: "",
    contact: stateadminAuthStatus? userInfo.contact: '',
    supply: "",
    partners: "Supplier"
  });

  const isToday = (date)=> {
    const Today =new Date();
    setData({...data, date:  Today.getDate() +'/'+ Today.getMonth() +'/'+ Today.getFullYear()})
  }

const ListWithWordLimit = ({ items, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to limit words across multiple <li> items
  const truncateList = (items, limit) => {
    let wordCount = 0;
    let truncatedItems = [];

    for (let item of items) {
      const words = item.split(' ');
      if (wordCount + words.length <= limit) {
        truncatedItems.push(item);  // Add the whole item if within limit
        wordCount += words.length;
      } else {
        const remainingWords = limit - wordCount;
        truncatedItems.push(words.slice(0, remainingWords).join(' ') + '...');
        break;
      }
    }
    return truncatedItems;
  };

  const displayedItems = isExpanded ? items : truncateList(items, limit);

  return (
    <div>
      <ul className='list-disc pl-5'>
        {displayedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button className='text-green-500' onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

const handleClick = ()=> {
  if(data.partners =='' || data.contact=='' || data.crop=='' || data.date == '' || data.state=='' || data.supply =='' ) {
    toast.error('Kindly fill all the fields before submit!')
    return
  }
    dispatch(addItem(data));
    toast.success('Request added successfully! ')
    
}


  return (
    <div className='w-full flex  flex-col'>
      <h1 className='text-white flex m-auto mt-5 text-xl font-bold bg-black rounded-lg py-2 px-3'>State Admin</h1>

      {/* <div className='w-full flex flex-col'>
      
      <h1 className='text-black flex m-auto mt-5 text-lg font-bold'>Create a Request</h1>

        <div className="flex justify-center items-center gap-4 p-5 flex-wrap text-nowrap">

<label htmlFor="partners">Partners:</label>
<select className='border-green-400 border-2 bg-gray-200' value={data.partners} onChange={(e)=> setData({...data, partners: e.target.value})}   disabled name="partners" id="partners" >
  <option disabled value="">select</option>
    <option value="Farmer">Farmer</option>
    <option value="Supplier">Supplier</option>
  </select>

  <label htmlFor="supply">Supply:</label>
    <select className='border-green-400 border-2' value={data.supply}  onChange={(e)=> setData({...data, supply: e.target.value})} name="supply" id="supply">
    <option disabled value="" >Select</option>
    <option value="Surplus">Surplus</option>
    <option value="Shortage">Shortage</option>
  </select>

  <label htmlFor="state">State:</label>
  <select disabled className='border-green-400 border-2 bg-gray-200'  value={data.state} onChange={(e)=> setData({...data, state: e.target.value})} name="state" id="state" >
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

  <label htmlFor="crop">Crop:</label>
    <select className='border-green-400 border-2'  name="crop" id="crop" value={data.crop} onChange={(e)=> setData({...data, crop: e.target.value})}>
    <option disabled value="" >Select</option>
    <option value="Wheat">Wheat</option>
    <option value="Rice">Rice</option>
    <option value="Corn">Corn</option>
    <option value="Millet">Millet</option>
    <option value="Sorghum">Sorghum</option>
    <option value="Barley">Barley</option>
  </select>

  <div>
      <label className='mr-3' htmlFor="date">Date:</label>
       <input id='date' value={data.date} disabled className='px-3 py-2 bg-gray-200 border-green-400 border-2 rounded-lg' type="text"  />
    </div>

  <input  value={data.contact} onChange={(e)=> setData({...data, contact: e.target.value})}  className='px-3 py-2 border-green-400 border-2 rounded-lg' type="text"  placeholder='Contact Number'/>
        </div>
        <span className='flex m-auto justify-center items-center gap-5 bg-yellow-200 border-2 border-yellow-600 bg-opacity-30 py-1 px-4 rounded-md flex-wrap'>
        <FaInfo className='text-white rounded-full p-[3px] bg-yellow-600'/>
        <h1>This form is to create a request by Supplier to allow the suppliers or states to know about the current availability of crops or foods.</h1>
        </span>
        <button onClick={handleClick}  className='hover:bg-green-600 mx-8 my-5 text-center text-white bg-green-500 border-green-700 border-2 rounded-md font-semibold py-2'>Submit</button>

        </div> */}
      <div className='w-full px-10 py-5 flex flex-col space-y-8'>
      <OptimizationForm state={userInfo.state}/>
      <RealTimeRequestForm userState={userInfo.state}/>
      </div>
       {/* <TableDataStateAdminFetch/> */}

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
    </div>
  )
}

export default StateAdmin
