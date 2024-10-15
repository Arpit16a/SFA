import React from 'react'
import Lottie, {LottiePlayer} from 'lottie-react'
import animationData from '../LottieFiles/Animation -home 1727040767658.json'

function Animation1({className=''}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie animationData={animationData} loop={true}/>
    </div>
  )
}

export default Animation1
