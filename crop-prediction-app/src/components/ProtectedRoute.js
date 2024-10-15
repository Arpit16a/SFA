import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const {adminAuthStatus, farmerAuthStatus, supplierAuthStatus, stateadminAuthStatus, consumerAuthStatus, vendorAuthStatus} = useSelector((state)=> state.auth)

    if(adminAuthStatus || farmerAuthStatus || supplierAuthStatus || stateadminAuthStatus || consumerAuthStatus || vendorAuthStatus){
      return children;
    }else{
      return <Navigate to='/'/>
    }
   

}

export default ProtectedRoute
