import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || feedback.trim() === '') {
      setErrorMessage('Please provide a rating and your feedback.');
      return;
    }
    setIsDialogOpen(true); // Open the dialog on successful submission
    setErrorMessage(''); // Clear any previous error message
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Optionally reset the form
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="flex items-center justify-center py-8 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">Feedback</h2>
        
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`cursor-pointer text-2xl ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => handleStarClick(index)}
            />
          ))}
        </div>

        <textarea
          rows="5"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Submit
        </button>
      </form>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2">Feedback Submitted!</h3>
            <p className="mb-4">Thank you for your feedback!</p>
            <button
              onClick={handleCloseDialog}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
