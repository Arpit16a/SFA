import React, {useState} from 'react';
import "./HomePage.css"
import Animation1 from '../LottieAnimations/Animation1.js';
import AirQualityApp from '../components/AirQuality.js';
import { useNavigate } from 'react-router-dom';


const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      <div className={`faq-answer ${isOpen ? 'show' : ''}`}>{answer}</div>
    </div>


    </>
  )
};

const HomePage = () => {
  const navigate = useNavigate()

  const faqData = [
    {
      question: 'What is SFA platform?',
      answer: 'SFA platform is a comprehensive web-based tool where users can access various machine learning models for making accurate predictions related to agriculture and create a better flow of food supply system. It offers solutions for crop management, soil health assessment and sustainable food system by crop management system, soil health assessment and fertilizer recommendation and better connection of supply system across states and cities.'
    },
    {
      question: 'How does SFA platform work?',
      answer: 'SFA platform works by integrating AI and ML models in our food system across each steps of our food system i.e. crop cultivation, crop harvesting, managing food surplus and shortages and giving a brief solution.' // Add the actual answer here
    },
    {
      question: 'Who can benefit from SFA platform?',
      answer: 'SFA platform can benefit Farmers, State Admins(or State Government), Suppliers, and Admins(Food and Agriculture Organisation.' // Add the actual answer here
    },
    {
      question: 'How can I contribute to SFA platform?',
      answer: 'You can contribute to SFA platform by giving the actual data of food , demand, production, yield and supply. You can also give us a feedback in our Feedback Page or you can Contact Us.' // Add the actual answer here
    },
  ];

  return (
    <div  className="home-page text-wrap flex-wrap">
          <section
            style={{backgroundImage: "url('https://www.unfi.com/content/dam/unfi-corporate/homepage/en/hp-services-bring-out-true-value.jpg')"}}
          className="h-screen w-full bg-cover bg-center ">
            <div className="flex w-full flex-col justify-center  text-white  h-full bg-black backdrop-blur-sm bg-opacity-50 p-4 md:p-10">
              <div className='w-full text-wrap md:w-1/2'>
                <h1 className='font-bold text-2xl  md:text-3xl mb-2'>Welcome To SFA</h1>
                  <p className="subtitle text-sm md:text-lg">A simple web-based platform where users can easily</p>
                    <div className="feature">
                      <div className="checkmark">✓</div>
                  <p className=' w-full md:w-1/2 text-ellipsis'>
                  <strong>Explore</strong> - Discover a variety of AI and ML models tailored to enhance farming
                  practices. From crop prediction to soil analysis, explore solutions designed
                  to optimize agricultural productivity and a better supply systems.
                </p>
              </div>
              <button onClick={()=> navigate('/whatwedo')} className="cta-button ml-10">Explore Now</button>
            </div>
            </div>
          </section>
          <section className='my-8'>
          <AirQualityApp/>
          </section>

      <main>
        <div className="container">
          <div className="hero">
            <div className="hero-content">
          
              <p className="subtitle text-black font-semibold text-lg">A simple web-based platform where users can easily</p>
              <div className="feature">
                <div className="checkmark">✓</div>
                <p>
                  <strong> Automate</strong> - Discover a variety of AI and ML models tailored to enhance farming
                  practices.Tailor fertilizer recommendations to specific soil types, crop varieties, and climate conditions for improved effectiveness.
                </p>
              </div>
              <div className="feature">
                <div className="checkmark">✓</div>
                <p>
                  <strong>Personalize</strong> - Streamline fertilizer application processes through precision agriculture technologies, reducing labor costs and increasing accuracy.
                  These pointers highlight key aspects of effective fertilizer recommendation systems.
                </p>
              </div>
              <div className="feature">
                <div className="checkmark">✓</div>
                <p>
                  <strong>Optimize</strong> - Maximize fertilizer efficiency, minimize waste, and enhance crop yields through data-driven recommendations.

                </p>
              </div>
             
            </div>
           <Animation1 className='md:w-1/2 w-full'/>
          </div>
        
          
        </div>

        <section className="offerings ">
            <h2 className='font-semibold text-black'> What we offer:</h2>
            <div className="offerings-grid px-10">
                <div className="offering-card">
                    <h3>↔ Responsive Design</h3>
                    <p>Our platform is designed to be fully responsive, ensuring a seamless experience on any device. Users can access our tools and resources on-the-go, whether on a smartphone, tablet, or desktop.</p>
                </div>
                <div className="offering-card">
                    <h3>📊 Comprehensive Models</h3>
                    <p>SFA platform offers various machine learning models for accurate predictions. These models help farmers to make informed decisions about crop management, soil health, and pest control.</p>
                </div>
                <div className="offering-card">
                    <h3>🖥 User-Friendly Interface</h3>
                    <p>Our intuitive interface allows users to easily navigate throughout the platform and utilize the AI and ML tools to solve their problem. The platform is designed to be accessible for users with technical knowledge.</p>
                </div>
                <div className="offering-card">
                    <h3>🔧 Customizable Solutions</h3>
                    <p>SFA provides customizable solutions to the unique needs of each farm. Farmers can adjust parameters to get the most accurate and relevant predictions by using AI and ML tools for their specific conditions.</p>
                </div>
            </div>
        </section>
        <div className="faq-container">
          <h1 className="faq-title text-black font-semibold text-xl">😮 Frequently Asked Questions 😮</h1>
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </main>
    

    </div>
  );
};

export default HomePage;