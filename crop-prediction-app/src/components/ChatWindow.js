// import axios from 'axios';
// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import Loading from './Loading';
// const socket = io({});
// const ChatWindow = ({ productId, buyerId, sellerId, isOpen = false, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [product, setProduct] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to track initial load
  
//   const messagesEndRef = useRef(null); // Reference for scrolling
//   const messagesContainerRef = useRef(null); // Ref for messages container

//   useEffect(() => {
//     setIsLoading(true)
//     // Fetch previous messages between buyer and seller for the product
//     axios.get(`/get_messages?sender_id=${buyerId}&reciever_id=${sellerId}&product_id=${productId}`)
//       .then(response => {
//         setMessages([...response.data]);
//         axios.get(`/product/${productId}`)
//         .then(response=> setProduct(response.data))
//         .catch(err=> console.log(err)
//         )
//         .finally(()=> setIsLoading(false))
//       })
//       .catch(err => console.log(err))

//     // Join a room for the buyer-seller chat
//     socket.emit('join_room', { room: buyerId+'_'+productId, user: buyerId });

//     socket.on('recieve_message', (message) => {
//       setMessages(prevMessages => [...prevMessages, message.message])
//       scrollToBottom(); // Scroll to the bottom when a new message is received
//     });

//     // return () => socket.off('recieve_message');
//   }, [buyerId,productId]);



//   // Scroll to the bottom of the messages (for new messages or initial load)
//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Check if the user is manually scrolling (not at the bottom)
//   const handleScroll = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
//       if (isAtBottom) {
//         scrollToBottom();
//       }
//     }
//   };

//   // Prevent sending empty or whitespace-only messages
//   const isValidMessage = (message) => {
//     return message.trim() !== '';
//   };

//   const sendMessage = () => {
//     if (!isValidMessage(newMessage)) return;

//     const messageData = {
//       sender_id: buyerId,
//       receiver_id: sellerId,
//       message: newMessage.trim(), // Trim any leading/trailing spaces
//       product_id: productId
//     };
//     scrollToBottom(); // Scroll to the bottom after sending a message
//     // fetch('/send_message', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(messageData)
//     // });
//     socket.emit('send_message', { room: buyerId+'_'+productId, user: buyerId, message: messageData });
//     setNewMessage('');
//     socket.on('recieve_message', (message) => {
//       setMessages(prevMessages => [...prevMessages, message.message])
//     });
//     scrollToBottom(); // Scroll to the bottom after sending a message
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <Loading isLoading={isLoading}/>
//       {!isLoading && (
//         <div className="bg-white rounded-lg shadow-lg w-96 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-white">
//           &times;
//         </button>
//         {product!= null && (<div className='flex items-center p-3 rounded-t-lg bg-gray-500 gap-5 text-gray-50'>
//           <img className='w-[50px] h-[50px] object-cover rounded-lg' src={product.image_url} alt="logo" />
//           <p>Name: {product.name}</p>
//           <p>Price: {product.price} {product.unitName}</p>
//         </div>)}
//         <br />
//         <div 
//           className="messages max-h-60 overflow-y-auto flex flex-col w-full mb-4 px-3"
//           ref={messagesContainerRef} // Ref for detecting scroll behavior
//           onScroll={handleScroll}    // Track scroll behavior
//         >
//           {messages && messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex break-words text-wrap p-2 max-w-56  w-fit my-1 rounded-lg ${msg.sender_id == buyerId
//                 ? 'bg-green-200 ml-auto text-right' // Buyer message on right
//                 : 'bg-gray-200 mr-auto text-left'    // Seller message on left
//               }`}
//             >
//               {msg.message}
//             </div>
//           ))}
//           {/* Ref for the end of messages */}
//           <div ref={messagesEndRef}></div>
//         </div>
//         <div className='w-full p-2'>
//         <input
//           type="text"
//           className="w-full p-2 border rounded-lg focus:outline-none"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="w-full bg-green-500 text-white p-2 rounded-lg"
//         >
//           Send
//         </button>
//         </div>
//       </div>
//       )}
      
//     </div>
//   );
// };

// export default ChatWindow;
