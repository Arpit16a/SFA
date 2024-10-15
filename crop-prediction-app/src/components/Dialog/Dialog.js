// src/components/Dialog.js
import React, { useEffect } from 'react';

const Dialog = ({ isOpen, onClose, children }) => {
  // Handle closing when clicking outside of the dialog
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === 'dialog-container') {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  // Return nothing if the dialog is not open
  if (!isOpen) return null;

  return (
    <div
      id="dialog-container"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-2xl top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        {/* Dialog Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;