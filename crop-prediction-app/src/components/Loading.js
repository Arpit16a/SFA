import React from 'react';

const Loading = ({ isLoading }) => {
  if (!isLoading) return null; // Render nothing if not loading

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg flex flex-col items-center">
        {/* Loading spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-75"></div>
        <p className="mt-4 text-green-700 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
