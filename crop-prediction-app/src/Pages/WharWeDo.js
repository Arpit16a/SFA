import React from 'react'
import {Link} from 'react-router-dom'

function WharWeDo() {
  
  return (
    <div>

      <div className='text-center p-6'>
        <label className='text-center font-bold text-2xl underline underline-offset-4'>
        Comprehensive Agricultural Decision-Making AI & ML Models for Optimized Farming</label>
        <p className='mt-4 text-lg'>This suite of agricultural models includes a <span className='font-semibold'>Crop Prediction Model</span> that suggests the best crops based on season and location, a <span className='font-semibold'>Specific Crop Recommendation Model</span> that tailors crop choices using soil, climate, and nutrient data, a <span className='font-semibold'>Fertilizer Recommendation Model</span> that optimizes fertilizer use based on soil nutrients and environmental factors, and a <span className='font-semibold'>Food Demand Predictor</span> that forecasts crop demand based on market trends and supply-chain data. Together, these models help farmers make data-driven decisions, improve productivity, reduce waste, and ensure sustainable, profitable agricultural practices tailored to specific conditions.</p>
      </div>

      <div className='grid-cols-none space-y-4 md:space-y-0 md:grid md:grid-cols-2 justify-center items-center p-10 gap-4'>
        <div className='m-auto p-8 border-green-400 border-2 rounded-md flex-col gap-12'>
          <h1 className='font-bold text-xl text-center mb-4'>Simple Crop Recommendation Model</h1>
          <p className='text-justify italic'>A <span className='font-semibold'>simple Crop Prediction Machine Learning (ML) </span> model is designed to predict the most suitable crops for cultivation based on two key inputs: <span className='font-semibold'>season name and state name. </span>This model leverages historical agricultural data, such as climate patterns, soil types, and regional crop yields, to provide accurate crop recommendations. By inputting the current season (e.g., monsoon, winter) and the state or region (e.g., Maharashtra, Punjab), the model analyzes which crops are most likely to thrive under these conditions. This helps farmers or agricultural planners make informed decisions, optimize resources, and improve yield outcomes.</p>
          <Link to='/simple-crop-recommendation'>
          <button className='bg-green-500 py-2 text-center w-full mt-4 text-white rounded-md border-green-600 border-2'> Simple Crop Recommendation Model</button></Link>
        </div>
        <div className='m-auto p-8 border-green-400 border-2 rounded-md flex-col gap-12'>
          <h1 className='font-bold text-xl text-center mb-4'>Specific Crop Recommendation Model</h1>
          <p className='text-justify italic'>A <span className='font-semibold'>specific Crop Recommendation Machine Learning model</span> uses multiple inputs such as <span className='font-semibold'>nitrogen, potassium, phosphorus levels, humidity, soil type, rainfall, pH, temperature, and the desired crop type</span> to suggest the best crops for cultivation. By analyzing these variables, the model predicts which crops will yield the highest output in given conditions. It leverages historical crop growth patterns and soil data to provide farmers with optimized recommendations, enabling them to improve productivity, minimize risks, and make data-driven agricultural decisions tailored to specific environments.</p>
          <Link to='/crop-recommendation'> 
          <button className='bg-green-500 py-2 text-center w-full mt-4 text-white rounded-md border-green-600 border-2'>Specific Crop Recommendation Model</button>
          </Link>
        </div>    
        <div className='m-auto p-8 border-green-400 border-2 rounded-md flex-col gap-12'>
          <h1 className='font-bold text-xl text-center mb-4'>Food Demand Predictor Model</h1>
          <p className='text-justify italic'>A <span className='font-semibold'>Food Demand Predictor</span> model forecasts the demand for various crops based on historical data and current market trends. By analyzing factors such as <span className='font-semibold'>consumer preferences, seasonal patterns, regional demand, economic conditions,</span> and <span className='font-semibold'>supply chain logistics,</span> the model predicts which crops will be in high demand. It also considers environmental aspects like weather and crop yield forecasts. This enables farmers, distributors, and retailers to make informed decisions about what to grow, stock, or distribute, ensuring that supply meets consumer demand while minimizing waste and maximizing profits.</p>
          <Link to='/food-demand'>
          <button className='bg-green-500 py-2 text-center w-full mt-4 text-white rounded-md border-green-600 border-2'>Food Demand Predictor Model</button>
          </Link>
        </div>
        <div className='m-auto p-8 border-green-400 border-2 rounded-md flex-col gap-12'>
          <h1 className='font-bold text-xl text-center mb-4'>Fertilizer Recommendation Model</h1>
          <p className='text-justify italic'>
          A <span className='font-semibold'>Fertilizer Recommendation Model</span>  provides tailored suggestions for optimal fertilizer usage based on inputs like <span className='font-semibold'>nitrogen, phosphorus, and potassium levels, humidity, soil type, rainfall, pH, temperature, and the specific crop</span> being grown. By analyzing these variables, the model recommends the precise type and amount of fertilizer needed to improve soil nutrient balance, boost crop yield, and enhance plant health. It leverages historical data and environmental factors to ensure efficient fertilizer usage, helping farmers minimize costs, reduce environmental impact, and achieve sustainable agricultural practices for their crops.</p>
          <Link to='/fertlizer'>
          <button className='bg-green-500 py-2 text-center w-full mt-4 text-white rounded-md border-green-600 border-2'>Fertilizer Recommendation Model</button>
          </Link>
        </div>
      </div>
      

      {/* supply system blog */}
      <div className='text-center p-6'>
        <label className='text-center font-bold text-2xl underline underline-offset-4'>
        Efficient Agricultural Supply and Management System</label>

        <p className='mt-4 text-lg'>This <span className='font-semibold'>Supply System</span> enables efficient communication and coordination between <span className='font-semibold'>farmers, suppliers,</span> and <span className='font-semibold'>state administrators</span> to manage agricultural crop supplies effectively. The system facilitates streamlined request management through the following features:</p>

        <ul className="list-disc p-10 m-auto text-justify text-lg">
          <li><span className='font-semibold'>Farmer Requests:</span> Farmers can submit requests indicating whether they have a surplus or shortage of specific crops, along with their contact information.</li>
          <li><span className='font-semibold'>Supplier Access:</span> Suppliers have the ability to view all supply requests submitted by farmers and can respond to them accordingly.</li>
          <li><span className='font-semibold'>State Admin Functions:</span> State administrators can submit requests for specific crop supplies within their state, ensuring regional agricultural needs are met.</li>
          <li><span className='font-semibold'>Admin Management:</span> Administrators can update or delete requests, maintaining accurate and up-to-date information for effective supply management.</li>
        </ul>
    </div>
    </div>
  )
}

export default WharWeDo
