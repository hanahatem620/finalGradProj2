'use client'
import Image from 'next/image'
import React from 'react'
import img from '../../../../public/images/artist.jpg'
import PaymentMethod from '@/app/_components/BookingSteps/PaymentMethod'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default function BookApointment() {
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

    <div>
        <h2 className='font-bold text-3xl'>Book Appointment</h2>
    </div>

    <div className='flex flex-col lg:flex-row gap-3 mt-4'>

    <div className='lg:w-[60%]'>
        <div className='shadow-md rounded-md p-5 flex items-center gap-2'>
            <div>
                <Image src={img} alt='Artist' width={50} height={50} className='rounded-full'/>
            </div>
            <div>
                <h2 className='font-bold'>Jessica M.</h2>
                <p className='text-gray-500'>Bridal Makeup Trial</p>
            </div>
        </div>

        <div className='shadow-md rounded-md p-5 '>
            <div>
                <h2 className='font-bold mb-3'>Select Service</h2>
            </div>

            <div className='flex flex-col gap-2'>

            <div className='flex justify-between border border-gray-200 p-2 rounded-md'>
                <div>
                    <h3 className='font-bold'>Bridal Makeup</h3>
                    <p className='text-gray-500 text-sm'>2 hours</p>
                </div>
                <p className='font-bold'>$125</p>
            </div>

            <div className='flex justify-between border border-gray-200 p-2 rounded-md'>
                <div>
                    <h3 className='font-bold'>Evening Makeup</h3>
                    <p className='text-gray-500 text-sm'>1.5 hours</p>
                </div>
                <p className='font-bold'>$85</p>
            </div>

            <div className='flex justify-between border border-gray-200 p-2 rounded-md'>
                <div>
                    <h3 className='font-bold'>Makeup Lesson</h3>
                    <p className='text-gray-500 text-sm'>1 hour</p>
                </div>
                <p className='font-bold'>$65</p>
            </div>


            </div>
        </div>

        <div className='shadow-md rounded-md p-5 mt-5'>
            <div>
                <h2 className='font-bold'>Select Date</h2>
            </div>
        </div>


        <div className='shadow-md rounded-md p-5 '>

        <div>
            <h2 className='font-bold'>Select Time</h2>
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

    <div className='bg-amber-300 w-full'>
        <PaymentMethod/>
    </div>

    </div>


<div className='lg:w-[40%]'>

    <div className='flex flex-col gap-3'>
        <div className='shadow-md rounded-md p-5'>

        <div>
          <h2 className='font-bold'>Booking Summary</h2>
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

        <div className='flex justify-between'>
            <h3 className='text-gray-500'>Date</h3>
            <p className='font-bold'>Selected Date</p>
        </div>

        <div className='flex justify-between'>
            <h3 className='text-gray-500'>Time</h3>
            <p className='font-bold'>Selected Time</p>
        </div>

        <Separator/>

        <div className='flex justify-between'>
            <h3 className='text-gray-500'>Total</h3>
            <p className='font-bold text-lg'>$125</p>
        </div>

        <div>
            <Button className='w-full bg-pink-500 text-white mt-5'>Confirm Booking</Button>
        </div>

        <div>
            <p className='text-sm text-gray-500'>You'll be charged after the appointment is completed.</p>
        </div>
        </div>

    </div>

    <div className='bg-pink-300 rounded-xl p-5'>
        <h2 className='font-bold '>Free Cancellation</h2>
        <p className='text-gray-500 text-sm mt-2'>Cancel up to 24 hours before your appointment for a full refund.</p>
    </div>
    </div>

</div>





    </div>

    </div>
    
    </>
  )
}
