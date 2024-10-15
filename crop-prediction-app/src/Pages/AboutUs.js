import React from 'react'

function AboutUs() {
  return (
    <div className='p-10 flex-col gap-6 space-y-8  text-justify'>
        <p>
        At <span className='font-semibold'>SFA</span>, our mission is to harness the power of <span className='font-semibold'>AI and ML</span>  to create smarter, more efficient, and sustainable urban agriculture systems. We aim to <span className='font-semibold'>reduce food waste</span>  and <span className='font-semibold'>optimize food distribution</span>  within cities, ensuring that urban communities enjoy a more sustainable food supply chain.
        </p>
        <div className='space-y-4'>
        <span className='font-bold text-xl'>🌱Our Objective:
        </span>
<p>To develop <span className='font-semibold'> AI-based systems </span>that:</p>

<ul className='space-y-2 list-disc px-4' >
    <li>Optimize <span className='font-semibold'>urban agriculture</span>  and food distribution networks</li>
    <li>Reduce <span className='font-semibold'>food waste </span>and improve efficiency</li>
    <li>Ensure a <span className='font-semibold'>sustainable food production</span> and supply chain in cities</li>
</ul>
</div>

       
          <div className='space-y-4'>
          <span className='font-bold text-xl'>📊Key Areas of Focus:</span>
<div>
<span className='font-semibold text-lg'>
1. Food Carbon Emissions 🌍</span>
<p>
We track and reduce the carbon footprint of urban food production and transportation to support eco-friendly practices.
</p>
</div>

<div>
<span className='font-semibold text-lg'>2. Food Wastage Data 🗑</span>
<p>
Our AI-driven models analyze food wastage data to minimize surplus and redirect excess food where it’s needed most, reducing waste across the supply chain.</p>
</div>
          </div>

          <div className='space-y-4'>
          <span className='font-semibold text-lg'> 📈 Additional Data Utilized:</span>
          <div>
          <span className='font-semibold text-lg'>1.Price Dataset 💵</span>
          <p>
We integrate price data to make real-time adjustments in food supply and demand, ensuring affordability and avoiding overproduction.</p>
</div>

<div>

<span className='font-semibold text-lg'>2.Food Security Index 🍽 </span>
<p>
Our system monitors the food security index to ensure that urban populations have consistent access to nutritious food, improving resilience to shortages.</p>
</div>
          </div>

          <div>
          Together, we are building a future where technology meets sustainability, optimizing urban food systems for  <span className='font-semibold'>healthier cities</span> and a  <span className='font-semibold'>healthier planet.</span>
          </div>

        </div>
  
  )
}

export default AboutUs
