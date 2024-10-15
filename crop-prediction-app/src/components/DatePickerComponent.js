import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { addDays, subDays} from 'date-fns'

function DatePickerComponent() {

  const [todayDate, setTodayDate]= useState();
  const isToday = (date)=> {
    const Today =new Date();
  
    setTodayDate(  Today.getDate() +'/'+ Today.getMonth() +'/'+ Today.getFullYear())
    
  }

  useEffect(()=> isToday(),[])
  return (
    <div>
      <label className='mr-3' htmlFor="date">Date:</label>
       <input id='date' value={todayDate} disabled className='px-3 py-2 bg-gray-200 border-green-400 border-2 rounded-lg' type="text"  />
    </div>
  )
}

export default DatePickerComponent
