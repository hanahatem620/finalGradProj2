'use client'
import HomeFooter from '../_components/HomeFooter/homeFooter'
import OurServices from '../_components/OurServices/ourServices'

export default function OurService() {
  return (
    <>
       <div className='py-16 bg-linear-to-b from-pink-50 to-purple-50'>
         <div className="flex flex-col items-center text-center">
        <h1 className="font-bold text-3xl">Our Services</h1>
        <p className="text-gray-500">Professional beauty services delivered by expert artists</p>
    </div>
    </div>

    <OurServices/>
    <HomeFooter/>
    
    
    </>
  )
}
