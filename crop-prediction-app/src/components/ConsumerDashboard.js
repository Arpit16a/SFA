import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaList, FaPen } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import Dialog from './Dialog/Dialog';

function ConsumerDashboard() {
  const {userInfo, consumerAuthStatus} = useSelector((state)=> state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if(consumerAuthStatus){
    axios.get(`/products`)
      .then(response => setProducts(response.data.products)
      )
      .catch(error => console.error(error));
    }
  }, []);
  const [orders, setOrders] = useState([])
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);

  // orders 

  useEffect(()=>{
    axios.get(`/orders/${userInfo.id}`)
    .then(response => setOrders(response.data.orders))
    .catch(error => console.error(error));
  },[loading])

  const handleOrderClick = async (sellerId, productId)=>{
    setLoading(true)
    axios.post(`order_request`, {buyerId: userInfo.id, sellerId: sellerId, productId: productId})
    .then(response => alert('Order Placed Successfully 🥳 !'))
    .catch(error => console.error(error))
    .finally(()=> setLoading(false))
  }
  return (
    <div>

            {/* nav btns */}
            <section>
        <div className='w-full grid-cols-2 space-x-4 flex justify-around  my-8 px-10 text-green-500'>
            
            <div onClick={()=> setIsDialogOpen1(true)} className='shadow-lg rounded-md p-4 text-xl font-bold flex gap-3 justify-center items-center w-1/2 border-green-500 border-2 cursor-pointer'>
                <FaList  className='text-lg'/>
                Manage Requests
            </div>
        </div>
      </section>


      {/* order products section  */}
      <section className='flex flex-col w-full my-10 px-10'>
        <h1 className='font-bold text-3xl m-auto'>Order Products:</h1>
        <h1 className={`${products.some(item=> item.type==='crop')? 'block': 'hidden'} text-xl font-semibold`}>Crop:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        {products.length==0 && (<h1>No data available.</h1>)}
      {products.map((product, index) => 
      product.user.type=='supplier' && (
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
        {/* <h1 className={`${product.type=='seed'? 'hidden': 'block'}`}>No item available.</h1> */}
        </>
      ))}
    </div>

    <h1 className={`${products.some(item=> item.type==='fertilizer')? 'block': 'hidden'} text-xl font-semibold`}>Fertilizer:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        
      {products.map((product, index) => 
      product.user.type=='supplier' && (
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
        {/* <h1 className={`${product.type=='fertlizer'? 'hidden': 'block'}`}>No item available.</h1> */}
        </>
      ))}
    </div>

    <h1 className={`${products.some(item=> item.type==='seed')? 'block': 'hidden'} text-xl font-semibold`}>Seed:</h1>
      <div className="flex gap-4 grid-cols-5 my-5">
        
      {products.map((product, index) => 
      product.user.type=='supplier' && (
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
          <button onClick={()=>handleOrderClick(product.user.id,product._id)}  className="bg-blue-500 rounded-md font-semibold my-2 text-white py-2  px-4">
            Order
          </button>
        </div>
        {/* <h1 className={`${product.type=='seed'? 'hidden': 'block'}`}>No item available.</h1> */}
        </>
      ))}
    </div>

      </section>

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
    </div>
  )
}

export default ConsumerDashboard
