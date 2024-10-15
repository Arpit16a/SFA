import React, { useState, useEffect, useRef } from 'react';
import { FaRobot } from 'react-icons/fa6';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${isUser ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'} shadow-lg`}>
      {message}
    </div>
  </div>
);

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
      />
      <button type="submit" className="bg-green-500 text-white p-2 px-4 rounded-r-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm">
        Send
      </button>
    </form>
  );
};

const PopupChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sendMessage = async (userMessage) => {
    setMessages((prevMessages) => [...prevMessages, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't process your request. Please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          ref={chatWindowRef}
          className="bg-white shadow-2xl rounded-lg w-80 sm:w-96 transition-all duration-300 ease-in-out transform fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="p-4 border-b bg-gray-200 flex justify-between items-center rounded-t-lg">
            <h1 className="text-lg font-semibold text-green-700">Kisanvaani Chatbot</h1>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
          <div className="p-4 h-96 overflow-y-auto bg-gray-50 rounded-b-lg">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.text} isUser={message.isUser} />
            ))}
            {isLoading && <div className="text-center text-gray-500">Kisanvaani is typing...</div>}
          </div>
          <div className="p-4 border-t bg-white">
            <ChatInput onSendMessage={sendMessage} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform transform hover:scale-105 mb-20 mr-2"
        >
          {/* Chatbot SVG Icon */}
          <FaRobot className='text-2xl'/>
        </button>
      )}
    </div>
  );
};

export default PopupChatbot;