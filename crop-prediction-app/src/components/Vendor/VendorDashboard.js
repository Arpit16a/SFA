import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaList, FaPen, FaXmark } from 'react-icons/fa6'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dialog from '../Dialog/Dialog';

function VendorDashboard() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const {userInfo, vendorAuthStatus} = useSelector((state)=> state.auth)
        console.log(userInfo);
        const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate= useNavigate()
    const [isDialogOpen1, setIsDialogOpen1] = useState(false);

        
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
        formData.append('id', vendorAuthStatus? userInfo.id: '');
       
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
      // displaying and deletion of inventory objects

      const [products, setProducts] = useState([]);

      useEffect(() => {
        if(vendorAuthStatus){
        axios.get(`/products/${userInfo.id}`)
          .then(response => setProducts(response.data))
          .catch(error => console.error(error));

          console.log(products);
          
        }
      }, [message]);
    
      const deleteProduct = async (id) => {
        setLoading(true)
        try {
          await axios.delete(`/products/${id}`);
          setProducts(products.filter(product => product._id !== id));
        } catch (error) {
          console.error(error);
        }finally{
          setLoading(false)
        }
      };

      // all requests fetching
      const [requests, setRequests] = useState([])

      useEffect(()=>{
        axios.get(`/requests/${userInfo.id}`)
        .then(response => setRequests(response.data.requests))
        .catch(error => console.error(error));
      },[])
    
    
  return (
    <div>
      {/* nav btns */}
      <section>
        <div className='w-full grid-cols-2 space-x-4 flex justify-around  my-8 px-10 text-green-500'>
            {/* create btn */}
            <div onClick={()=> setIsDialogOpen({...isDialogOpen, status: true})} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaPen className='text-lg'/>
                Create Catalogue
            </div>
            <div onClick={()=> setIsDialogOpen1(true)} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaList className='text-lg'/>
                Manage Requests
            </div>
        </div>
      </section>

      {/* inventory section  */}
      <section className='flex flex-col w-full my-10'>
        <h1 className='font-bold text-3xl m-auto'>Your Inventory</h1>
      <div className="flex gap-4 px-10 grid-cols-5 mx-auto my-5">
      {products.map(product => (
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

      <Dialog isOpen={isDialogOpen1} onClose={()=> setIsDialogOpen1(false)}>
        <div className='w-full p-4 flex flex-col'>
          <h1 className='m-auto text-3xl font-bold my-4'>Requests</h1>
          {requests.map((request,index)=>(
            <div key={index} className='w-full my-3 p-2 flex gap-3 items-center  border-2 border-green-400 shadow-lg rounded-md bg-white'>
            <img className='w-[50px] h-[50px] object-cover rounded-md' src={request.product.image_url} alt="icon" />
            <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold'>{request.product.name}</p>
            <p className='text-sm font-semibold text-gray-500'>Buyer's Contact: {request.buyer.contact}</p>
            </div>
            <p className='text-lg font-semibold'>Price: ₹ {request.product.price} {request.product.unitName}</p>
          </div>
          ))}
        </div>
      </Dialog>
    </div>
  )}


export default VendorDashboard
