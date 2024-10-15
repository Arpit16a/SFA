import React from 'react'

function BlogsGovtSchemes() {
  return (
    <div className='flex w-full flex-col'>
        <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-2xl font-bold'>Government Schemes And Subsidies</h1>
        <section className='flex'>
            <div className='w-1/2 text-justify p-8'>
              <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-lg font-bold'>Here are some detailed ways in which farmers benefit from government schemes and subsidies in India:</h1>

              <ul className="list-disc pl-5">
                <li>PM-KISAN provides direct cash transfers of ₹6,000 annually to small and marginal farmers. This immediate income support helps farmers meet their daily needs and invest in seeds, fertilizers, or other agricultural inputs, reducing financial stress.</li>
                <li>The Kisan Credit Card (KCC) scheme allows farmers to access low-interest loans for crop production and other agricultural activities. By providing loans at a 4% interest rate (with timely repayment), farmers can avoid taking loans from moneylenders at high interest rates, reducing their debt burden.</li>
                <li>Pradhan Mantri Fasal Bima Yojana (PMFBY) insures farmers against crop loss due to natural disasters, pests, and diseases. Farmers pay very nominal premiums, and the government subsidizes the majority of the insurance cost.</li>
                <li>Soil Health Card scheme helps farmers improve productivity by providing detailed information on soil health, guiding them on the proper use of fertilizers and micronutrients. As a result, farmers can optimize their input use, which leads to better yields while reducing excessive use of chemicals.</li>
                <li>Through Pradhan Mantri Krishi Sinchai Yojana (PMKSY) and its "Per Drop More Crop" component, farmers receive subsidies to install micro-irrigation systems like drip and sprinkler irrigation. This results in better water management, reduced wastage, and higher yields, especially in drought-prone areas.</li>
              </ul>
            </div>

            <div className='flex justify-center items-center w-1/2 p-8'>
            <img className='rounded-lg' src="https://timesofagriculture.in/wp-content/uploads/2023/08/feature-image-2-1-1-1-1536x864.jpg" alt="" />
            </div>
        </section>
       
    </div>
  )
}

export default  BlogsGovtSchemes

