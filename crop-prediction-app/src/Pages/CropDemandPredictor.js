import React, { useState } from 'react';
import Animation3 from '../LottieAnimations/Animation3';
import Animation2 from '../LottieAnimations/Animation2';
import Animation4 from '../LottieAnimations/Animation4';

const CropDemandPredictor = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/predictions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPredictions(data);

      
    } catch (err) {
      setError('Failed to fetch predictions. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
<>
<div className='min-h-screen py-10'>
       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Crop Demand Predictor</h2>

<section className="page1 w-full">
          <div className="lPart w-1/2">
            <section className="about-model">
              <h3 className="font-bold text-xl ">Forecasting Future Demand for Smart Farming
              </h3>
              <h4 className="font-semibold text-lg mb-4 mt-2 ">AI and ML powered platform predicting crop demand to optimize production, reduce waste, and increase profitability, this year</h4>
              <p className="text-justify ">
                The Crop Demand Predictor revolutionizes how farmers choose
                crops. Data-driven decisions maximize yields and profits.Plan production according to forecasted demand.
                Timely supply of essential crops. Stay ahead of market trends and competitors.
                </p>
            </section>

            <section className="how-it-works">
              <h3 className="font-bold text-xl">How it Works!</h3>
              <ul>
                <li>● Historical data on crop production, consumption, and market trends.</li>
                <li>● Machine Learning: Train algorithms to identify patterns and correlations.</li>
                <li>●  Model Deployment: Generate forecasts based on input data.</li>
              </ul>
            </section>
          </div>
          <div className="rPart w-1/2 flex items-start justify-start ">
            <Animation3 className=" h-[60%] m-auto"/>
          </div>
        </section>

    {/* form goes here */}
    <div className="container max-w-2xl mx-auto justify-center items-center flex flex-col p-20 bg-white rounded-lg shadow-md border-blue-500 border-2 ">
      <h1 className="text-2xl font-bold my-4 m-auto">Crop Demand Predictions</h1>
      <p className="mb-4">Showing predictions for Rice, Wheat, and Corn</p>
      <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={fetchPredictions}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Predictions'}
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}

     
      {predictions && (
        <div>
          <h2 className='font-bold'>Predictions for Year {predictions.year}</h2>
          <ul className='list-disc pl-3'>
            {Object.entries(predictions.predictions).map(([crop, value]) => (
              <li key={crop}>
                {crop}: {value.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <section className="need-for-recommendation mt-8">
          <div className="image-container">
            <Animation4 className="h-[300px] w-[300px] scale-[1.3]"/>
          </div>
          <div className="content">
            <h3 className="font-bold text-xl">Need for Crop Predictor Model</h3>
            <p className="text-justify mb-8">
              The Crop Predictor System revolutionizes how farmers choose
              crops. It takes into account the season of a particular region i.e. states name and season name.
            </p>
            <h4 className="font-bold text-xl">How it Works!</h4>
            <ul className="list-disc pl-5">
              <li>Analyze average climatic conditions.</li>
              <li>Get crop demand based on user input.</li>
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
                Increases crop yield by selecting the most suitable crops based on recent demands.
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
    </>
  );
};

export default CropDemandPredictor;