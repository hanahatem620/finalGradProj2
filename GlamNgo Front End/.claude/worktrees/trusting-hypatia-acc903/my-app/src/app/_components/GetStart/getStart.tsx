import { Button } from '@/components/ui/button'
import React from 'react'
import ServiceBookingBtn from '../ServiceBookingBtn/serviceBookingBtn'

export default function GetStart() {
  return (
    <>
    <div className='py-12 bg-linear-to-b from-pink-100 to-purple-100'>
        <div className='container w-[80%] mx-auto flex flex-col items-center gap-3'>
            <h1 className='font-bold text-3xl'>
                Ready to Get Started?
            </h1>
            <p className='text-gray-500'>Join thousands of happy customers who trust us with their beauty needs</p>
              <div>
                <ServiceBookingBtn title='Book Your First Service' />
              </div>
        </div>
    </div>
    
    
    
    </>
  )
}
