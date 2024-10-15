import React from 'react'
import Lottie, {LottiePlayer} from 'lottie-react'
import animationData from '../LottieFiles/Animation - 4-1727072434162.json'

function Animation4({className=''}) {
  return (
    <div>
    <div className={`flex justify-start items-start ${className}`}>
  <Lottie animationData={animationData} loop={true}/>
</div>
  </div>
  )
}

export default Animation4
