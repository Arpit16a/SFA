import React from 'react'

function BlogIrrigation() {
  return (
    <div className='flex w-full flex-col'>
        <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-2xl font-bold'>Smart Irrigation Systems</h1>
        <section className='flex'>
            <div className='w-1/2 text-justify p-8'>
              <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-lg font-bold'>Here are some detailed ways in which farmers benefit from smart irrigation system in India:</h1>

              <ul className="list-disc pl-5">
                <li>Smart irrigation systems like drip and sprinkler irrigation reduce water wastage by delivering water directly to the plant roots, minimizing evaporation and runoff.</li>
                <li>These systems use sensors to monitor soil moisture, weather conditions, and crop water needs, allowing automatic adjustments to irrigation schedules for optimal water use.</li>
                <li>By using only the necessary amount of water, smart irrigation helps reduce energy costs associated with pumping water and lowers overall water consumption, leading to long-term savings for farmers.</li>
                <li>Various government schemes, such as Pradhan Mantri Krishi Sinchai Yojana (PMKSY), provide subsidies for installing smart irrigation systems, making them more affordable for farmers.</li>
                <li>By providing consistent and precise irrigation, these systems help improve crop health and productivity, leading to better yields and higher income for farmers.</li>
                <li>Smart irrigation adapts to changing weather conditions, making farming more resilient to droughts and unpredictable rainfall patterns, especially in water-scarce regions.</li>
              </ul>
            </div>

            <div className='flex justify-center items-center w-1/2 p-8'>
            <img className='rounded-lg' src="https://www.hydropoint.com/wp-content/uploads/What-is-smart-irrigation-1.jpeg" alt="" />
            </div>
        </section>
       
    </div>
  )
}

export default BlogIrrigation
