import React, { lazy, Suspense } from 'react'
import CropRecommendationPage from './Pages/CropRecommendationPage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AboutUs from './Pages/AboutUs'
import Header from './components/Header.js';
import Footer from './components/Footer'
import FertilizerRecommendation from './Pages/FertilizerRecommendation.js';
import User from './Pages/User.js';

import BlogsGovtSchemes from './Pages/Blogs/BlogsGovtSchemes.js';
import BlogsOrganic from './Pages/Blogs/BlogsOrganic.js';
import BlogIrrigation from './Pages/Blogs/BlogIrrigation.js';
import HomePage from './Pages/HomePage.js';
import SimpleCropRecommendation from './Pages/SimpleCropRecommendation.js';
import Supplier from './Pages/Supplier.js';
import BlogEVs from './Pages/Blogs/BlogEVs.js';
import StateAdmin from './Pages/StateAdmin.js';
import WharWeDo from './Pages/WharWeDo.js';
import CropDemandPredictor from './Pages/CropDemandPredictor.js';
import Admin from './Pages/Admin.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import WeatherApp from './Pages/WeatherApp.js';
import Feedback from './Pages/Feedback.js';
import QuickLinks from './Pages/QuickLinks.js';
import Marketplace from './Pages/Marketplace.js';
import PersonailsedChatbot from './Pages/PersonailsedChatbot.js';
import VendorInventory from './components/Vendor/VendorInventory.js';



function App() {
  return (
    <div className='min-h-screen'>
      
      <Router>
    <Header/>
      <Routes>
      <Route path='/' element={<><HomePage/><PersonailsedChatbot /></>}/>
        <Route path='/crop-recommendation' element={<CropRecommendationPage/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/fertlizer' element={<FertilizerRecommendation/>}/>
        <Route path='/farmer' element={<ProtectedRoute><User/></ProtectedRoute>}/>
        <Route path='/blogs/govt-schemes' element={<BlogsGovtSchemes/>}/>
        <Route path='/blogs/organic-farming' element={<BlogsOrganic/>}/>
        <Route path='/blogs/irrigation' element={<BlogIrrigation/>}/>
        <Route path='/food-demand' element={<CropDemandPredictor/>}/>
        <Route path='/simple-crop-recommendation' element={<SimpleCropRecommendation/>}/>
        <Route path='/supplier' element={<ProtectedRoute><Supplier/></ProtectedRoute>}/>
        <Route path='/blogs/ev' element={<BlogEVs/>}/>
        <Route path='/state-admin' element={<ProtectedRoute><StateAdmin/></ProtectedRoute>}/>
        <Route path='/whatwedo' element={<WharWeDo/>}/>
        <Route path='/admin' element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path='/feedback' element={<Feedback/>}/>
        <Route path='/quicklinks' element={<QuickLinks/>}/>
        <Route path='/vendor-inventory' element={<VendorInventory/>}/>
        <Route path='/marketplace' element={<ProtectedRoute><Marketplace/></ProtectedRoute>}/>
      </Routes>
      <Footer/>
    </Router>

    </div>
  )
}

export default App
