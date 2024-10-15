import React from 'react'
import Lottie, {LottiePlayer} from 'lottie-react'
import animationData from '../LottieFiles/Animation - 5-1727072605953.json'

function Animation5({className=''}) {
  return (
    <div>
      <div className={`flex justify-start items-start ${className}`}>
    <Lottie animationData={animationData} loop={true}/>
  </div>
    </div>
  )
}

export default Animation5
