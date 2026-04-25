import React from 'react'
import HowItWorks from '../_components/HowItWorks/howItWorks'
import GetStart from '../_components/GetStart/getStart'
import HomeFooter from '../_components/HomeFooter/homeFooter'

export default function HowItWork() {
  return (
    <>
    <div className='py-16 bg-linear-to-b from-pink-50 to-purple-50'>
         <div className="flex flex-col items-center text-center">
        <h1 className="font-bold text-3xl">How It Works</h1>
        <p className="text-gray-500">Booking your perfect beauty experience is simple and seamless</p>
    </div>
    </div>

    <HowItWorks/>

    <GetStart/>
    <HomeFooter/>
    
    
    
    
    </>
  )
}
