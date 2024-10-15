// src/QuickLinks.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faCarrot, faAppleAlt, faFish, faLeaf } from '@fortawesome/free-solid-svg-icons';

const QuickLinks = () => {
  const links = [
    { id: 1, title: "Sustainable Farming", url: "https://www.google.com", icon: faSeedling },
    { id: 2, title: "Organic Produce", url: "https://www.google.com", icon: faAppleAlt },
    { id: 3, title: "Plant-Based Diet", url: "https://www.google.com", icon: faCarrot },
    { id: 4, title: "Aquaculture", url: "https://www.google.com", icon: faFish },
    { id: 5, title: "Permaculture", url: "https://www.google.com", icon: faLeaf },
  ];

  return (
    <div className="py-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Quick Links</h1>
        <div className="grid grid-cols-2 gap-4">
          {links.map(link => (
            <div key={link.id}>
              <a
                href={link.url}
                className="flex items-center space-x-3 block border-2 border-green-500 text-green-500 text-center py-3 px-4 rounded hover:bg-green-500 hover:text-white transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={link.icon} className="w-6 h-6" />
                <span>{link.title}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
