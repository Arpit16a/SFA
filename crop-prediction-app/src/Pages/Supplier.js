import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../components/DatePickerComponent';
import { Link, useNavigate } from 'react-router-dom';
import {FaInfo, FaList, FaPen, FaXmark, FaEye} from 'react-icons/fa6'
import CropDropDown from '../components/CropDropDown';
import TableWithDataFetch from '../components/TableWithDataFetch';
import {useDispatch, useSelector}   from 'react-redux'
import {getItems, addItem, updateItem, deleteItem} from '../redux/actions/itemsActions.js'
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Dialog from '../components/Dialog/Dialog.js';
import ChatWindow from '../components/ChatWindow.js';
import InventoryManagement from '../components/SupplyModel/InventoryManagement.js';
import SupplierOptimisation from '../components/SupplyModel/SupplierOptimisation.js';


function Supplier() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const {userInfo, supplierAuthStatus} = useSelector((state)=> state.auth);
  const [data, setData] = useState({
    crop: "", 
    state: "",
    date: "",
    contact:"",
    supply: "",
    partners: "Supplier"
  });
  // dialog form to create inventory itemn
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
  const [isChatOpen, setIsChatOpen] = useState({status:false, producutId:"", sellerId:"", buyerId:""})
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    setMessage('')
    setError('')
    setLoading((prev)=>!prev)
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('type', type);
    formData.append('unitName', unit);
    formData.append('id', supplierAuthStatus? userInfo.id : '');
    try {
      await axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product created successfully');
    } catch (error) {
      console.error(error);
      setError(error)
    }finally{
      setLoading((prev)=>!prev)
      handleCloseDialog()
    }
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
  
  // supplier utilities
  const isToday = (date)=> {
    const Today =new Date();
    setData({...data, date:  Today.getDate() +'/'+ Today.getMonth() +'/'+ Today.getFullYear()})
  }

  useEffect(()=> isToday(),[])


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

// displaying and deletion of inventory objects

const deleteProduct = async (id) => {
  setLoading(true)
  try {
    await axios.delete(`/products/${id}`);
    setMyInventory(myInventory.filter(product => product._id !== id));
  } catch (error) {
    console.error(error);
  }finally{
    setLoading(false)
  }
};

const [myInventory, setMyInventory] = useState([]);
useEffect(() => {
  if(supplierAuthStatus){
  axios.get(`/products/${userInfo.id}`)
    .then(response => setMyInventory(response.data))
    .catch(error => console.error(error));
  }
}, [message]);


const [products, setProducts] = useState([]);

const [isDialogOpen1, setIsDialogOpen1] = useState(false);
const [isDialogOpen2, setIsDialogOpen2] = useState(false);

useEffect(() => {
  if(supplierAuthStatus){
  axios.get(`/products`)
    .then(response =>setProducts(response.data.products)
    )
    .catch(error => console.error(error));
  }
}, []);

  // manage orders
  
  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])


  useEffect(()=>{
    axios.get(`/orders/${userInfo.id}`)
    .then(response => setOrders(response.data.orders))
    .catch(error => console.error(error));

    axios.get(`/requests/${userInfo.id}`)
    .then(response => setRequests(response.data.requests))
    .catch(error => console.error(error));
  },[loading])

  const handleOrderClick = async (sellerId, productId)=>{
    setLoading(true)
    axios.post(`/order_request`, {buyerId: userInfo.id, sellerId: sellerId, productId: productId})
    .then(response => alert('Order Placed Successfully 🥳 !'))
    .catch(error => console.error(error))
    .finally(()=> setLoading(false))
  }

  const handleAcceptRequest = (id)=>{
    setLoading(true)
    axios.put(`/order/accept`, {id: id})
    .then(response => alert('Request accepted successfully 🥳 !'))
    .catch(error => console.error(error))
    .finally(()=> setLoading(false))
  }
  return (
    <div className='w-full flex flex-col p-5'>
      <h1 className='text-white flex m-auto mt-5 text-xl font-bold bg-black rounded-lg py-2 px-3'>Supplier</h1>
      {/* nav btns */}
      <section>
        <div className='w-full grid-cols-2 space-x-4 flex justify-around  my-8 px-10 text-green-500'>
            {/* create btn */}
            <div onClick={()=> setIsDialogOpen({...isDialogOpen, status: true})} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaPen className='text-lg'/>
                Create Catalogue
            </div>
            <div onClick={()=> setIsDialogOpen1(true)} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaEye className='text-lg'/>
                View Orders
            </div>
            <div onClick={()=> setIsDialogOpen2(true)} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaEye className='text-lg'/>
                Manage Requests
            </div>
        </div>
      </section>

      <div className=' w-full px-10 py-5 flex flex-col space-y-8'>
        <SupplierOptimisation state={userInfo.state}/>
        <InventoryManagement/>
      </div>
    

      {/* <TableWithDataFetch/> */}


        {/* order products section  */}
      <section className='flex flex-col w-full my-10 px-10'>
        <h1 className='font-bold text-3xl m-auto'>Order Products:</h1>
        <h1 className={`${products.some(item=> item.type==='crop')? 'block': 'hidden'} text-xl font-semibold`}>Crop:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        {products.length==0 && (<h1>No data available.</h1>)}
      {products.map((product, index) => (
        <>
        <div key={product._id} className={`${product.type=='crop' && product.createdBy != userInfo.id?  'block': 'hidden'} p-4 w-fit rounded-md shadow-lg flex flex-col`}>
          <img src={product.image_url} alt={product.name} className=" w-[200px] h-[200px] object-cover"/>
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className='text-lg font-semibold '>Price: ₹ {product.price} {product.unitName}</p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>Username: {product.user.username} </p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>State: {product.user.state} </p>
            <p className='text-lg font-semibold '>Contact: {product.user.contact}</p>
          </div>
          <button onClick={()=>handleOrderClick(product.user.id,product._id)}  className="bg-blue-500 rounded-md font-semibold my-2 text-white py-2  px-4">
            Order
          </button>
        </div>
        </>
      ))}
    </div>

    <h1 className={`${products.some(item=> item.type==='fertilizer')? 'block': 'hidden'} text-xl font-semibold`}>Fertilizer:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        
      {products.map((product, index) => (
        <>
        <div key={product._id} className={`${product.type=='fertilizer' && product.createdBy != userInfo.id? 'block':'hidden'} p-4 w-fit rounded-md shadow-lg flex flex-col`}>
          <img src={product.image_url} alt={product.name} className=" w-[200px] h-[200px] object-cover"/>
          <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className='text-lg font-semibold '>Price: ₹ {product.price} {product.unitName}</p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>Username: {product.user.username} </p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>State: {product.user.state} </p>
            <p className='text-lg font-semibold '>Contact: {product.user.contact}</p>
          </div>
          <button onClick={()=>handleOrderClick(product.user.id,product._id)}  className="bg-blue-500 rounded-md font-semibold my-2 text-white py-2  px-4">
            Order
          </button>
        </div>
        </>
      ))}
    </div>

    <h1 className={`${products.some(item=> item.type==='seed')? 'block': 'hidden'} text-xl font-semibold`}>Seed:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        
      {products.map((product, index) => (
        <>
        <div key={product._id} className={`${product.type=='seed' && product.createdBy != userInfo.id?  'block':'hidden'} p-4 w-fit rounded-md shadow-lg flex flex-col`}>

          <img src={product.image_url} alt={product.name} className=" w-[200px] h-[200px] object-cover"/>
          <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className='text-lg font-semibold '>Price: ₹ {product.price} {product.unitName}</p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>Username: {product.user.username} </p>
            <p className='text-lg flex gap-3 flex-wrap font-semibold '>State: {product.user.state} </p>
            <p className='text-lg font-semibold '>Contact: {product.user.contact}</p>
          </div>
          <button onClick={()=>handleOrderClick(product.user.id,product._id)} className="bg-blue-500 rounded-md font-semibold my-2 text-white py-2  px-4">
            Order
          </button>
        </div>
        </>
      ))}
    </div>

      </section>

     {/* inventory section  */}
    <section className='flex flex-col w-full my-10'>
        <h1 className='font-bold text-3xl m-auto'>Your Listed Products</h1>
      <div className="flex gap-4 px-10 grid-cols-5 mx-auto my-5">
      {myInventory.map(product => (
        <div key={product._id} className="p-4 w-fit rounded-md shadow-lg flex flex-col justify-center items-center">
          <img src={product.image_url} alt={product.name} className=" w-[200px] h-[200px] object-cover"/>
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className='text-lg font-bold '>₹ {product.price} {product.unit}</p>
          </div>
          <button onClick={() => deleteProduct(product._id)} className="bg-red-500 rounded-md font-semibold my-2 text-white py-2 flex gap-2 justify-center items-center px-4">
          {loading==true && (<div className="animate-spin rounded-full h-3 w-3 border-t-4 border-b-4 border-white"></div>)}
            Delete
          </button>
        </div>
      ))}
    </div>

      </section>

      <section className='w-full flex mb-8 flex-col '>
          <h1 
          onClick={()=> navigate('/blogs')}
          className='text-black flex m-auto text-3xl font-bold'>Related Blogs</h1>
          <div className='w-full flex justify-between '>
            <div
            className='border-green-400 cursor-pointer border-2 rounded-md m-2 p-3 w-1/4'>
              <h1
              onClick={()=> navigate('/blogs/ev')}
              className='text-green-500 flex m-auto mt-5 text-lg font-bold'>Electric Vehicles(EVs)</h1>
              <p className='text-justify '>
              <ListWithWordLimit items={ [
    'Electric vehicles offer a sustainable alternative to traditional gasoline-powered vehicles, reducing greenhouse gas emissions and air pollution in urban areas, thus contributing to a cleaner environment and improved public health.',
    'EVs can reduce energy consumption in transportation, helping countries meet climate goals and reduce carbon footprint.',
    'EVs can enhance public health by reducing air pollution, particularly in urban areas.'
  ]} limit={20} />
              </p>
            </div>

           {/* upload form section */}
      <section>
      {isDialogOpen.status && (
        <div className="fixed inset-0 flex items-center justify-center z-[11]  bg-black bg-opacity-50  w-full ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <div className='flex-col w-full'>
            <FaXmark onClick={handleCloseDialog} className='text-2xl hover:scale-[0.9] cursor-pointer text-gray-500'/>
      <h2 className='m-auto text-3xl font-bold capitalize'>Submit </h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <input
        type="text"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <select
        
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border-gray-200 mb-4"
      >
        <option disabled className='text-gray-500' value="">--type--</option>
        <option value="crop">crop</option>
        <option value="seed">seed</option>
        <option value="fertilizer">fertilizer</option>
      </select>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-full p-2 border-gray-200 mb-4"
      >
        <option disabled className='text-gray-500' value="">--unit--</option>
        <option value="per kg">per kg</option>
        <option value="per quintal">per quintal</option>
      </select>
            <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-2 border mb-4"
      />
      {error && <p className='flex w-full m-auto' style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button type="submit" className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 w-full rounded-md flex justify-center items-center gap-3">
      {loading==true && (<div className="animate-spin rounded-full h-3 w-3 border-t-4 border-b-4 border-white"></div>)}
        Create Product
      </button>
    </form>

      </div>
      </div>
      </div>)}
      </section>
            
          </div>
        </section>
        {/* view your orders  */}
        <Dialog isOpen={isDialogOpen1} onClose={()=> setIsDialogOpen1(false)}>
        <div className='w-full p-4 flex flex-col'>
          <h1 className='m-auto text-3xl font-bold my-4'>Your Orders</h1>


          {orders.map((order,index)=>(
            <div key={index} className='w-full my-3 p-2 flex gap-3 items-center  border-2 border-green-400 shadow-lg rounded-md bg-white'>
            <img className='w-[50px] h-[50px] object-cover rounded-md' src={order.product.image_url} alt="icon" />
            <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold'>{order.product.name}</p>
            <p className='text-sm font-semibold text-gray-500'>Buyer's Contact: {order.seller.contact}</p>
            </div>
            <p className='text-lg font-semibold'>Price: ₹ {order.product.price} {order.product.unitName}</p>
          </div>
          ))}
        </div>
      </Dialog>

      {/* manage requests */}
      {/* <Dialog isOpen={isDialogOpen2} onClose={()=> setIsDialogOpen2(false)}>
        <div className='w-full p-4 flex flex-col'>
          <h1 className='m-auto text-3xl font-bold my-4'>Requests</h1>


          {requests.map((request,index)=>(
            <div key={index} className='w-full my-3 p-2 flex gap-3 items-center  border-2 border-green-400 shadow-lg rounded-md bg-white'>
            <img className='w-[50px] h-[50px] object-cover rounded-md' src={request.product.image_url} alt="icon" />
            <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold'>{request.product.name}</p>
            <p className='text-sm font-semibold text-gray-500'>Buyer's Contact: {request.seller.contact}</p>
            </div>
            <p className='text-lg font-semibold'>Price: ₹ {request.product.price} {request.product.unitName}</p>
            <button onClick={handleAcceptRequest} className='px-2 py-1 bg-blue-400 border-2 border-blue-600 text-white'>
            Accept
          </button>
          </div>
          
          ))}
        </div>
      </Dialog> */}

      {isChatOpen.status && (
        <ChatWindow
        productId={isChatOpen.producutId}
        sellerId={isChatOpen.sellerId}
        buyerId={isChatOpen.buyerId}
        isOpen={isChatOpen}
        onClose={()=> setIsChatOpen({...isChatOpen, status:false})}/>
        
      )}
    </div>
  )
}

export default Supplier
