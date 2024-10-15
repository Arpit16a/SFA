import React, { useState } from 'react'
import './CropRecommendationPage.css'
import axios from 'axios';
import Animation5 from '../LottieAnimations/Animation5';
import Animation3 from '../LottieAnimations/Animation3';

function FertilizerRecommendation() {

        const [selectCropType, setSelectCropTupe] = useState("");
        const [selectSoilType, setSelectSoilType] = useState("");
      // const [error, setError] = useState(null);
      // const [isLoading, setIsLoading] = useState(false);
      
      const [formData, setFormData] = useState({
        temperature: '',
        humidity: '',
        moisture: '',
        soil: '',
        crop: '',
        nitrogen: '',
        potassium: '',
        phosphorous: '',
      });
      const [prediction, setPrediction] = useState('');
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`/api/predict`, formData);
          setPrediction(response.data.prediction);
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
  return (
    <div>
       <main>
        <h2 className='font-bold text-2xl'>Fertilizer Recommendation Model</h2>
        <section className="page1">
          <div className="lPart">
            <section className="about-model">
              <h3 className='font-semibold text-lg'>About Fertilizer Recommendation Model</h3>
              <h4 className='font-semibold mb-2 text-lg'>Empowering Farmers with AI and ML Driven Crop Insights</h4>
              <p className='text-justify px-2'>
              The Fertilizer Prediction System transforms how farmers manage nutrient application. It considers essential parameters like soil type,temperature🌡️,humidity💧,and moisture levels,along with key nutrients such as nitrogen,potassium ,and phosphorous.By analyzing these factors,farmers can ensure optimal fertilizer usage,leading to higher yields 📈 and sustainable farming practices.
              </p>
            </section>

            <section className="how-it-work">
              <h3 className='text-lg font-semibold'>How it Works!</h3>
              <ul className='list-disc pl-5'>
                <li>Analyze soil and environmental parameters for nutrient needs.</li>
                <li>Get precise fertilizer Predictions based on data.</li>
                <li>Make informed decisions on nutrient management.</li>
              </ul>
            </section>
          </div>
          <div className="rPart">
            <img src="https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892233/EducationHub/photos/crops-growing-in-thailand.jpg" alt="" />
          </div>
        </section>

        <div className="page2">
          <section className="recommendation-form">
            <h3>Fertilizer Recommendation</h3>
            <form onSubmit={handleSubmit} >
              <div className="form-row w-full flex flex-wrap ">
                <div className="w-1/2 mb-4 flex flex-nowrap">
                  <label>
                  Temperature
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                  />
                      </div>
                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label >
                Humidity
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                
                  required
                />
                      </div>
                      <div key='' className="w-1/2 mb-4 flex flex-nowrap">
                <label>
                Moisture
                </label>
                  <input
                    type="number"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleChange}
                    required
                  />
                      </div>
                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label>
                Nitrogen
                </label>
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                    required
                  />
                      </div>
                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label>
                Potassium
                </label>
                  <input
                     type="number"
                     name="potassium"
                     value={formData.potassium}
                     onChange={handleChange}
                     className="border rounded px-2 py-1"
                     required
                  />
                      </div>
                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor='' >
                Phosphorous
                </label>
                  <input
                    type="number"
                    name="phosphorous"
                    value={formData.phosphorous}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                    required
                  />
                      </div>
                      {/* <div className="w-1/2 mb-4 flex flex-nowrap">
                <label>
                Soil
                </label>
                  <input
                     type="text"
                     name="soil"
                     value={formData.soil}
                     onChange={handleChange}
                    
                     required
                  />
                      </div>
                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor='' >
                Crop
                </label>
                  <input
                    type="text"
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    
                    required
                  />
                      </div> */}
                <div className="w-1/2 mb-4 flex flex-nowrap">
                 <label  htmlFor='crop-type' >
                    Crop Type
                </label>
                  <select name="crop-type" id="crop-type" value={formData.crop} onChange={(e)=> 
                   { setFormData({ ...formData, crop: e.target.value })
                    }}>
                 
                    <option disabled value="">Select</option>
                    <option value="Barley">Barley</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Ground Nuts">Ground Nuts</option>
                    <option value="Maize">Maize</option>
                    <option value="Millets">Millets</option>
                    <option value="Oil Seeds">Oil Seeds</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Tobacco">Tobacco</option>
                    <option value="Wheat">Wheat</option>
                  </select> 
                      </div>

                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor='soil-type' >
                    Soil Type
                </label>
                  <select name="soil-type" id="soil-type" value={formData.soil} onChange={(e)=> 
                   {setFormData({ ...formData, soil: e.target.value })
                    }}>
                  
                    <option disabled value="">Select</option>
                    <option value="Black">Black</option>
                    <option value="Clayey">Clayey</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Red">Red</option>
                    <option value="Sandy">Sandy</option>
                  </select> 
                      </div>
              </div>
              <button
              
              className={`'bg-blue-400'}`}
              type="submit">{ 'Predict Fertilizer that is suitable'}</button>

              {prediction && (
                <div className="mt-4">
                <h2 className="text-xl font-semibold">Predicted Fertilizer:</h2>
                <p>{prediction}</p>
              </div>
            )}
            </form>
          </section>
        </div>

        <section className="need-for-recommendation">
        
          <div className="image-container">
            <Animation5 className='w-[300px] h-[300px] scale-[1.2]'/>
          </div>
          <div className="content">
            <h3 className='font-semibold text-lg'>Need for Fertilizer Prediction</h3>
            <p className='text-justify mb-5 px-2'>
            The Fertilizer Prediction System helps farmers optimize crop yields by providing tailored fertilizer suggestions based on soil quality. By analyzing essential parameters such as nutrient levels 🧪, moisture content 💧, and environmental conditions , farmers can ensure their crops receive the right nutrients for healthy growth.
            </p>
            <h4 className='font-semibold text-lg'>How it Works!</h4>
            <ul className='list-disc pl-5'>
              <li>Assess soil nutrient requirements based on crop type and growth stage.</li>
              <li>Analyze environmental factors like temperature and humidity.</li>
              <li>Provide precise fertilizer Predictions for optimal growth.</li>
              <li>Enhance crop yield and sustainability through informed decision-making.</li>
              <li>Continuously update Predictions based on real-time data.</li>
            </ul>
          </div>
        </section>

        <section className="advantages-disadvantages flex gap-16 mt-8">
        <div>
          
          <p className='text-justify mb-5 px-2 pr-24'> <span className='font-bold mr-3'>#</span>Fertilizer Predictions play a crucial role in enhancing agricultural productivity. However, they come with both benefits and drawbacks that farmers must consider for effective crop management.</p>
          <div className="advantages">
            <h4 className='text-lg font-semibold'>Advantages:</h4>
            <ul className='list-disc pl-5 mb-5'>
              <li>Helps farmers make data-driven decisions.</li>
              <li>
                Increases crop yield by selecting the most suitable crops.
              </li>
              <li>
                Reduces the risk of crop failure by considering environmental
                factors.
              </li>
              <li>Optimizes resource use like water and fertilizers.</li>
            </ul>
          </div>
          
          </div>
          <div className="image-container flex justify-center items-center">
            <Animation3 className='w-[300px] h-[300px] scale-[2]'/>
          </div>
        </section>
      </main>
    </div>
  )
}

export default FertilizerRecommendation
