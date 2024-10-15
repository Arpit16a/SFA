import React from 'react'
import { useSelector } from 'react-redux'
import ConsumerDashboard from '../components/ConsumerDashboard'
import VendorDashboard from '../components/Vendor/VendorDashboard'

function Marketplace() {
  const {vendorAuthStatus, consumerAuthStatus} = useSelector((state)=> state.auth)
  return (
    <>
        <section>
           {vendorAuthStatus && (
            <VendorDashboard/>
           )}
           {consumerAuthStatus && (
            <ConsumerDashboard/>
           )}
        </section>
    </>
  )
}

export default Marketplace
