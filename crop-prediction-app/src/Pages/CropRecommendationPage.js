import React, { useEffect, useState } from "react";
import './CropRecommendationPage.css'
import axios from 'axios';
import Animation3 from "../LottieAnimations/Animation3";
import Animation2 from "../LottieAnimations/Animation2";
import Animation4 from "../LottieAnimations/Animation4";

const API_URL = 'http://localhost:5000';

const CropRecommendationPage = () => {
    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
      });
      const [predictions, setPredictions] = useState([]);
      const [error, setError] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [serverStatus, setServerStatus] = useState('Checking...');
      const [serverInfo, setServerInfo] = useState('');
      const [selectCropType, setSelectCropTupe] = useState("");
      const [selectSoilType, setSelectSoilType] = useState("");
    
      useEffect(() => {
        checkServerStatus();
      }, []);
    
      const checkServerStatus = async () => {
        try {
          const response = await axios.get(`${API_URL}/`);
          setServerStatus('Online');
          setServerInfo(response.data.predictions);
        } catch (error) {
          setServerStatus('Offline');
          console.error('Server status check failed:', error);
        }
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPredictions([]);
    
        try {
          const response = await axios.post('/predict', formData);
          if (response.data.status === 'success') {
            setPredictions(response.data.predictions);
          } else {
            setError(response.data.error || 'An unknown error occurred');
          }
        } catch (error) {
          console.error('Error:', error);
          setError(error.response?.data?.error || error.message || 'An error occurred while connecting to the server.');
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="crop-recommendation-page w-full">
      <main className="w-full">
        <h2 className="font-semibold text-xl  w-full">Specific Crop Recommendation Model</h2>
        <section className="page1 w-full">
          <div className="lPart w-1/2">
            <section className="about-model">
              <h3 className="font-bold text-xl ">About Crop Recommendation Model</h3>
              <h4 className="font-semibold text-lg ">Empowering Farmers with AI-Driven Crop Insights</h4>
              <p className="text-justify ">
                The Crop Recommendation System revolutionizes how farmers choose
                crops. It takes into account the mineral composition of the
                soil, including potassium, nitrogen and phosphorous, as well as
                factors like humidity, temperature and rainfall. By analyzing
                these factors, farmers can ensure optimal crop selection,
                leading to higher yields and sustainable farming practices.
              </p>
            </section>

            <section className="how-it-works">
              <h3 className="font-bold text-xl">How it Works!</h3>
              <ul>
                <li>● Analyze soil and environmental parameters.</li>
                <li>● Get precise crop recommendations based on data.</li>
                <li>● Make informed decisions on crop management.</li>
              </ul>
            </section>
          </div>
          <div className="rPart w-1/2 flex items-start justify-start ">
            <Animation3 className=" h-[60%] m-auto"/>
          </div>
        </section>

        <div className="page2">
          <section className="recommendation-form">
            <h3>Crop Recommendation</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row w-full flex flex-wrap ">

              {Object.keys(formData).map((key) => (
                  <div key={key} className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor={key} >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  />
                      </div>
               
                 ))}

<div className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor='crop-type' >
                    Crop Type
                </label>
                  <select name="crop-type" id="crop-type" value={selectCropType} onChange={(e)=> setSelectCropTupe(e.target.value)}>
                    <option disabled value="">Select</option>
                    <option value="barley">Barley</option>
                    <option value="cotton">Cotton</option>
                    <option value="ground nuts">Ground Nuts</option>
                    <option value="maize">Maize</option>
                    <option value="millets">Millets</option>
                    <option value="oil seeds">Oil Seeds</option>
                    <option value="paddy">Paddy</option>
                    <option value="pulses">Pulses</option>
                    <option value="sugarcane">Sugarcane</option>
                    <option value="tobacco">Tobacco</option>
                    <option value="wheat">Wheat</option>
                  </select>
                      </div>

                      <div className="w-1/2 mb-4 flex flex-nowrap">
                <label  htmlFor='soil-type' >
                    Soil Type
                </label>
                  <select name="soil-type" id="soil-type" value={selectSoilType} onChange={(e)=> setSelectSoilType(e.target.value)}>
                    <option disabled value="">Select</option>
                    <option value="black">Black</option>
                    <option value="clayey">Clayey</option>
                    <option value="loamy">Loamy</option>
                    <option value="red">Red</option>
                    <option value="sandy">Sandy</option>
                  </select>
                      </div>
              </div>
              <button
            className={`${isLoading && 'bg-blue-400'}`}
              type="submit">{isLoading ? 'Predicting...' : 'Predict Crop that is suitable'}</button>

{error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

{predictions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Top Predicted Crops:</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((pred, index) => (
               <div key={pred} className="bg-gray-100 p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800">{pred.crop}</h4>
              <p className="text-2xl font-bold text-blue-600">{(pred.probability * 100).toFixed(2)}%</p>
              </div>
            ))}
             </ol>
        </div>
      )}
            </form>
          </section>
        </div>

        <section className="need-for-recommendation mt-8">
          <div className="image-container">
            <Animation4 className="h-[300px] w-[300px] scale-[1.3]"/>
          </div>
          <div className="content">
            <h3 className="font-bold text-xl">Need for Crop Recommendation</h3>
            <p className="text-justify mb-8">
              The Crop Recommendation System revolutionizes how farmers choose
              crops. It takes into account the mineral composition of the soil,
              including potassium, nitrogen, and phosphorous, as well as factors
              like humidity, temperature, and rainfall.
            </p>
            <h4 className="font-bold text-xl">How it Works!</h4>
            <ul className="list-disc pl-5">
              <li>Analyze soil and environmental parameters.</li>
              <li>Get precise crop recommendations based on data.</li>
              <li>Make informed decisions on crop management.</li>
            </ul>
          </div>
        </section>

        <section className="advantages-disadvantages flex  w-full">
          <div className="w-1/2 justify-center items-center space-y-5">
          <div className="disadvantages">
            
            <ul className="pl-5">
              <li># Requires accurate and up-to-date data for best results.</li>
              <li># May need ongoing support and updates to stay effective.</li>
            </ul>
          </div>

          <div className="advantages">
            <h4 className="font-bold text-xl">Advantages:</h4>
            <ul className="list-disc pl-5">
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
          <div className="image-container w-1/2">
            <Animation2/>
          </div>
        </section>
      </main>

      {/* <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>AgroTech AI</h3>
            <p>
              AgroTech AI platform provides various Machine Learning models for
              predictions.
            </p>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Price Prediction</a>
              </li>
              <li>
                <a href="#">Forecast</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright">Copyright © 2024 AgroTech AI</div>
      </footer> */}
    </div>
  );
};

export default CropRecommendationPage;