// src/components/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io();

const SellerChat = ({ sellerId }) => {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    // Fetch list of buyers and their products from backend
    axios.get('/api/get_buyers_with_products')
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error(err));

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  // When the seller selects a buyer, join their chat room
  const selectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setMessages([]); // Clear previous messages
    const roomId = `${buyer._id}_${buyer.product_id}`;
    socket.emit('join', { room_id: roomId, user_id: sellerId });

    // Fetch previous messages between seller and selected buyer
    axios.get(`/api/get_chat_history?room_id=${roomId}`)
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.error(err));
  };

  const sendMessage = () => {
    if (selectedBuyer && message.trim()) {
      const roomId = `${selectedBuyer._id}_${selectedBuyer.product_id}`;
      const timestamp = new Date();
      socket.emit('send_message', {
        room_id: roomId,
        user_id: sellerId,
        message,
        timestamp,
      });
      setMessage(''); // Clear the input
    }
  };

  return (
    <div className="flex h-screen">
      {/* Buyer List Panel */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Buyers</h2>
        {buyers.map((buyer) => (
          <div
            key={buyer._id}
            className={`p-2 mb-2 cursor-pointer rounded-lg ${selectedBuyer && selectedBuyer._id === buyer._id ? 'bg-green-300' : 'bg-white'}`}
            onClick={() => selectBuyer(buyer)}
          >
            <p className="font-medium">{buyer.name}</p>
            <p className="text-sm text-gray-500">Product: {buyer.product_name}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 p-4">
        {selectedBuyer ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">{selectedBuyer.name}</h3>
              <p className="text-sm text-gray-500">Product: {selectedBuyer.product_name}</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.sender === sellerId ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg ${msg.sender === sellerId ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    <p>{msg.message}</p>
                  </div>
                  <span className="block text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center p-4 border-t">
              <input
                type="text"
                className="flex-1 p-2 border rounded mr-2"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a buyer to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChat;
