import React from 'react'

function BlogEVs() {
  return (
    <div className='flex w-full flex-col'>
        <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-2xl font-bold'>Electric Vehicles(EVs)</h1>
        <section className='flex'>
            <div className='w-1/2 text-justify p-8'>
              <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-lg font-bold'>Here are some detailed ways in which our environment and our people benefit from Electric Vehicles in India:</h1>

              <ul className="list-disc pl-5">
                <li> EVs are highly energy-efficient, converting about 60-70% of the electrical energy from the grid to power the wheels, while gasoline-powered vehicles only convert about 20% of the energy in gasoline to power the wheels.
                </li>
                <li> Electric vehicles require less maintenance than traditional vehicles, with fewer moving parts, no oil changes, and longer-lasting brakes, resulting in lower operating costs and reduced downtime.
                </li>
                <li> Electric vehicles offer a sustainable alternative to traditional gasoline-powered vehicles, reducing greenhouse gas emissions and air pollution in urban areas, thus contributing to a cleaner environment and improved public health.
                </li>
                <li>Governments worldwide offer incentives and tax credits to encourage the adoption of electric vehicles, making them more affordable and economically viable.
                </li>
                <li> EVs have the potential to reduce dependence on fossil fuels, enhancing energy security and mitigating the impact of price volatility.
                </li>
              </ul>
            </div>

            <div className='flex rounded-lg w-1/2 justify-center items-center p-8'>
            <img className='rounded-lg object-cover' src="/ev.jpg" alt="" />
            </div>
        </section>
       
    </div>
  )
}

export default  BlogEVs

