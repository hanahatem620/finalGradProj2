'use client'
import Image from 'next/image'
import React from 'react'
import img from '../../../../public/images/artist.jpg'
import PaymentMethod from '@/app/_components/BookingSteps/PaymentMethod'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function BookApointment() {
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

    <div>
        <h2 className='font-bold text-3xl'>Reschedule Appointment</h2>
    </div>

    <div className='flex flex-col lg:flex-row gap-3 mt-4'>

    <div className='lg:w-[60%]'>
        
        <div className='shadow-md rounded-md p-5 '>
            <h2 className='font-bold mb-3'>Current Booking</h2>
            
            <div className='flex items-center gap-2'>
                <div>
                <Image src={img} alt='Artist' width={50} height={50} className='rounded-full'/>
            </div>
            <div>
                <h2 className='font-bold'>Jessica M.</h2>
                <p className='text-pink-500'>Bridal Makeup Trial</p>
                <p className='text-gray-500 text-sm'>Glam Studio, Downtown</p>
            </div>
            </div>

            <div className='bg-yellow-100 p-3 mt-3 border border-yellow-400 rounded-md flex justify-between'>

                <div>
                    <h2 className='text-yellow-400'>Current Date</h2>
                    <p className='font-bold'>Thursday, June 15, 2026</p>
                </div>

                <div>
                    <h2 className='text-yellow-400'>Current Time</h2>
                    <p className='font-bold'>10:00 AM - 11:30 AM</p>
                </div>

            </div>

        </div>

        <div className='shadow-md rounded-md p-5 mt-5'>
            <div>
                <h2 className='font-bold'>Select New Date</h2>
            </div>
        </div>


        <div className='shadow-md rounded-md p-5 '>

        <div>
            <h2 className='font-bold'>Select New Time</h2>
        </div>

        <div>

        <div className='flex flex-row flex-wrap gap-2 w-xs'>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>9:00 AM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>10:00 AM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>11:00 AM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>12:00 PM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>1:00 PM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>2:00 PM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>3:00 PM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>4:00 PM</p>
            <p className='border border-gray-300 rounded-md py-1 px-3 '>5:00 PM</p>
        </div>


        </div>

        </div>

        <div className='shadow-md rounded-md p-5'>

            <h2 className='font-bold mb-3'>Reason for Rescheduling</h2>
            <Textarea placeholder='Let the artist know why you need to reschedule.' className='w-full border border-gray'/>

        </div>

    </div>


<div className='lg:w-[40%]'>

    <div className='flex flex-col gap-3'>
        <div className='shadow-md rounded-md p-5'>

        <div>
          <h2 className='font-bold'>Reschedule Summary</h2>
        </div>

        <div className='flex flex-col gap-1 text-sm'>
            <div className='flex justify-between'>
            <h3 className='text-gray-500'>Artist</h3>
            <p className='font-bold'>Jessica M.</p>
        </div>

        <div className='flex justify-between'>
            <h3 className='text-gray-500'>Service</h3>
            <p className='font-bold'>Bridal Makeup</p>
        </div>

        <div className='flex justify-between'>
            <h3 className='text-gray-500'>Duration</h3>
            <p className='font-bold'>2 hours</p>
        </div>


        <Separator/>

        <div className='bg-pink-200 p-4 rounded-md mt-3'>
             <div>
            <h3 className='text-pink-500 font-bold'>From:</h3>
            <p className='text-gray-500'>Tomorrow, June 16, 2026</p>
            <p className='text-gray-500'>10:00 AM - 11:30 AM</p>
        </div>

        <div>
            <h3 className='text-pink-500 font-bold'>To:</h3>
            <p className='font-bold'>Select new date</p>
            <p className='font-bold'>Select New time</p>
        </div>

        </div>

        <div>
            <Button className='w-full bg-pink-500 text-white mt-5'>Confirm Reschedule</Button>
            <Button variant='outline' className='w-full mt-2'>Cancel</Button>
        </div>
        </div>

    </div>

    <div className='bg-pink-300 rounded-xl p-5'>
        <h2 className='font-bold '>Free Reschedule</h2>
        <p className='text-gray-500 text-sm mt-2'>Reschedule up to 24 hours before your appointment at no extra charge.</p>
    </div>
    </div>

</div>





    </div>

    </div>
    
    </>
  )
}
