import React from 'react'

function BlogsOrganic() {
  return (
    <div className='flex w-full flex-col'>
    <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-2xl font-bold'>Organic Farming</h1>
    <section className='flex'>
        <div className='w-1/2 text-justify p-8'>
          <h1 className='text-green-500 cursor-pointer flex m-auto mt-5 text-lg font-bold'>Here are some detailed ways in which farmers benefit from organic farming in India:</h1>

          <ul className="list-disc pl-5">
            <li>Organic farming promotes healthier soils by avoiding synthetic fertilizers and pesticides, which can degrade soil quality over time.Reduced use of chemicals leads to healthier ecosystems, benefiting biodiversity, including pollinators like bees and other beneficial insects.Organic food is often perceived as healthier by consumers due to the absence of chemical.</li>
            <li>Organic certification is essential for farmers wanting to market their products as organic, both domestically and internationally.In India, certification bodies like APEDA (Agricultural and Processed Food Products Export Development Authority) ensure that farming practices comply with national organic standards under the National Program for Organic Production (NPOP).</li>
            <li>Government schemes such as Paramparagat Krishi Vikas Yojana (PKVY) provide financial assistance for promoting organic farming in clusters to increase production.Mission Organic Value Chain Development for North East Region (MOVCDNER) focuses on increasing organic farming in the northeastern states, which are naturally inclined towards organic practices.</li>
            <li>There is growing consumer demand for organic products, driven by health consciousness and environmental concerns.Organic markets, both national and global, are expanding, providing farmers with lucrative opportunities.Organic produce often fetches higher prices, improving farmer income and livelihood.</li>
            <li>Organic farming relies on natural inputs such as green manure, compost, and bio-fertilizers.Vermicomposting and crop rotation are widely used to improve soil fertility and reduce pests.Organic farmers use biological methods to control pests, including natural predators, traps, and botanical pesticides like neem oil.</li>
          </ul>
        </div>

        <div className='flex justify-center items-center rounded-lg p-8'>
        <img className=' object-cover bg-cover rounded-lg w-fit h-fit' src="https://www.aromaticandallied.com/uploads/blog/202404/img_660be77949ffa7-73444220-84857755.jpg" alt="" />
        </div>
    </section>
   
</div>
  )
}

export default BlogsOrganic
