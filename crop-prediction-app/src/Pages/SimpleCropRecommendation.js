import React, { useState } from 'react';
import axios from 'axios';
import Animation3 from '../LottieAnimations/Animation3';
import Animation4 from '../LottieAnimations/Animation4';
import Animation2 from '../LottieAnimations/Animation2';

const SimpleCropRecommendation = () => {
  const [season, setSeason] = useState('');
  const [state, setState] = useState('');
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/simple-predict', { season, state });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get prediction. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className=" flex flex-col p-16 min-h-screen">
      <h2 className="font-bold text-xl  w-full">Simple Crop Recommendation Model</h2>

<section className="page1 w-full">
          <div className="lPart w-1/2">
            <section className="about-model">
              <h3 className="font-bold text-xl ">About Simple Crop Recommendation Model</h3>
              <h4 className="font-semibold text-lg ">Empowering Farmers with AI and ML Driven Crop Insights</h4>
              <p className="text-justify ">
                The Simple Crop Recommendation System revolutionizes how farmers choose
                crops. It takes into account the production of food of each past years according to seasons and states based on Annual Rainfall and yield. By analyzing
                these factors, farmers can ensure optimal crop selection,
                leading to higher yields and sustainable farming practices.
              </p>
            </section>

            <section className="how-it-works">
              <h3 className="font-bold text-xl">How it Works!</h3>
              <ul>
                <li>● Analyze season and state.</li>
                <li>● Get approximate crop recommendations based on data.</li>
                <li>● Make informed decisions on crop management.</li>
              </ul>
            </section>
          </div>
          <div className="rPart w-1/2 flex items-start justify-start ">
            <Animation3 className=" h-[60%] m-auto"/>
          </div>
        </section>

      {/* form and prediction */}
      <div className='m-auto flex flex-col bg-gray-100 border-blue-400 border-2 rounded-md p-5 w-1/2'>
      <h1 className="text-2xl font-bold my-8 m-auto ">Crop Prediction System</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className='flex justify-evenly gap-4'>
        <div className="mb-4 w-1/3 flex gap-4 justify-center items-center">
          <label htmlFor="season" className="block font-semibold mb-2">Season:</label>
          <select className='border-blue-400 border-2'  name="state" id="state" value={season} onChange={(e)=> setSeason(e.target.value)}>
            <option disabled value="" >Select</option>
            <option value="Whole Year">Whole Year</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Autumn">Autumn</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <div className="mb-4 w-1/3 flex gap-4 justify-center items-center">
          <label htmlFor="state" className="block mb-2">State:</label>
          <select className='border-blue-400 border-2'  name="state" id="state" value={state} onChange={(e)=> setState(e.target.value)}>
            <option disabled value="" >Select</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chattisgarh">Chattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
  </select>
        </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white w-full px-4 py-2 rounded border-2 border-blue-700 font-semibold" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {prediction.length > 0 && (

<div className="mt-8">
<h2 className="text-2xl font-semibold mb-4 text-gray-700">Top Predicted Crops:</h2>
<ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {prediction.map((crop, index) => (
     <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
    {/* <h4 className="text-lg font-medium text-gray-800">{pred.crop}</h4> */}
    <p className="text-2xl font-bold text-blue-600">{crop}</p>
    </div>
  ))}
   </ol>
</div>

        // <div className='flex flex-col justify-center items-center'>
        //   <h2 className="text-xl font-bold mb-2">Top 5 Predicted Crops:</h2>
        //   <ul className="list-disc pl-5">
        //     {prediction.map((crop, index) => (
        //       <li key={index}>{crop}</li>
        //     ))}
        //   </ul>
        // </div>
      )}
      </div>

      <section className="need-for-recommendation mt-8">
          <div className="image-container">
            <Animation4 className="h-[300px] w-[300px] scale-[1.3]"/>
          </div>
          <div className="content">
            <h3 className="font-bold text-xl">Need for Simple Crop Recommendation</h3>
            <p className="text-justify mb-8">
              The Simple Crop Recommendation System revolutionizes how farmers choose
              crops. It takes into account the season of a particular region i.e. states name.
            </p>
            <h4 className="font-bold text-xl">How it Works!</h4>
            <ul className="list-disc pl-5">
              <li>Analyze average climatic conditions.</li>
              <li>Get approximate but simple to use crop recommendations based on user input.</li>
              <li>Make informed decisions on crop management.</li>
            </ul>
          </div>
        </section>

        <section className="advantages-disadvantages flex  w-full">
          <div className="w-1/2 justify-center items-center space-y-5">
          <div className="disadvantages">
            <ul className="pl-5">
              <li># Gives not exact but approximate answer and simple to use.</li>
              <li># May need ongoing support and updates to stay effective.</li>
            </ul>
          </div>
          <div className="advantages">
            <h4 className="font-bold text-xl">Advantages:</h4>
            <ul className="list-disc pl-5">
              <li>Helps farmers make simple decisions.</li>
              <li>
                Increases crop yield by selecting the most suitable crops.
              </li>
              <li>
                No initial cost required.
              </li>
            </ul>
          </div>
         
          </div>
          <div className="image-container w-1/2">
            <Animation2/>
          </div>
        </section>
    </div>
  );
};

export default SimpleCropRecommendation;