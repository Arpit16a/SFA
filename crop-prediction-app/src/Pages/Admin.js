import React, { useState } from 'react'
import TableWithDataFetch from '../components/TableWithDataFetch'
import PredictionForm from '../components/SupplyModel/PredictionForm'
import EmissionsTable from '../components/SupplyModel/EmissionsTable'
import PastRequests from '../components/SupplyModel/PastRequests'
import { useSelector } from 'react-redux'


function Admin() {
  const {userInfo, supplierAuthStatus} = useSelector((state)=> state.auth);

 
  return (
    <div className='w-full flex  flex-col p-5'>
    <h1 className='text-white flex m-auto mt-5 text-xl font-bold bg-black rounded-lg py-2 px-3'>Admin</h1>

    <div className=' w-full px-10 flex flex-col space-y-6 py-5'>
        <PredictionForm/>
        <EmissionsTable/>
        <PastRequests/>
      </div>

    {/* <TableWithDataFetch isActionVisible= {true} /> */}
    
    </div>
  )
}

export default Admin
