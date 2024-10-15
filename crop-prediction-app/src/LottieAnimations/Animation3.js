import React from 'react'
import Lottie, {LottiePlayer} from 'lottie-react'
import animationData from '../LottieFiles/Animation - 1727068158524.json'

function Animation3({className=''}) {
  return (
    <div>
      <div className={`flex justify-center items-center ${className}`}>
    <Lottie animationData={animationData} loop={true}/>
  </div>
    </div>
  )
}

export default Animation3;
