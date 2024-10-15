import React, { useState } from "react";

const FarmerRequest = ({state='Maharashtra'}) => {
  const [formData, setFormData] = useState({
    state: state,
    supply: "Surplus", // Hardcoded as Surplus
    quantity: "",
    crop: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('/farmer-realtime-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: formData.state,
          crop: formData.crop,
          type: formData.supply,
          quantity: Number(formData.quantity),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create request');
      }
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Error creating request: ' + error.message);
    }
    // Add your form submission logic here
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Farmer Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">State Name</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Supply</label>
            <input
              type="text"
              name="supply"
              value={formData.supply}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 bg-gray-100  rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Crop</label>
            <select
              type="text"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="w-full mt-1 p-2 border transition-all duration-100  border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            >
              <option disabled className="" value="">--select--</option>
              <option value='Wheat'>Wheat</option>
              <option value='Rice'>Rice</option>
              <option value='Maize'>Maize</option>
              <option value='Onion'>Onion</option>
              <option value='Potato'>Potato</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerRequest;
