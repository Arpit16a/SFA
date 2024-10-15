import React from 'react'
import Lottie, {LottiePlayer} from 'lottie-react'
import animationData from '../LottieFiles/Animation - 1727043179455(1).json'

function Animation2({className=''}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
    <Lottie animationData={animationData} loop={true}/>
  </div>
  )
}

export default Animation2
