'use client'
import React from 'react'
import { GiTargeted } from "react-icons/gi";
import cele from '../../../../public/images/confetti.png'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BsDot } from "react-icons/bs";



export default function ClaimNow() {
  return (
    <>
         <div className='container lg:w-[80%]  w-[90%] mx-auto py-10 flex flex-col items-center gap-5'>

        <div className='flex flex-col items-center gap-1'>
          
      <div className='bg-pink-200 p-2 w-fit rounded-full'>
        <GiTargeted className='text-pink-500 text-3xl'/>
      </div>

      <div className='flex items-center justify-center '>
        <h1 className='font-semibold text-3xl'>Special offer!</h1>
        <Image src={cele} alt="" width={25} height={25} />
      </div>

      <p className='text-xs text-gray-500'>Exclusive discount just for you!</p>


        </div>


        <div className='bg-pink-200 p-10 rounded-md'>

        <div className='text-center flex flex-col gap-1'>
          <p className='text-sm text-gray-600'>Get</p>
          <h1 className='text-5xl font-bold'>20% OFF</h1>
          <p className='text-gray-600 font-semibold text-sm'>Your Next Facial Treatment</p>
          <p className='text-xs text-gray-500'>Valid until October 31, 2024</p>
        </div>

        <div className='bg-white p-5 mt-3 rounded-md flex flex-col gap-2'>

          <h1 className='font-bold text-xl'>How to Redeem</h1>

          <ul className='flex flex-col gap-2'>
            <li className='flex items-center gap-1'>
              <span className='bg-pink-500 px-2 py-0.5 w-fit rounded-full text-white'>1</span>
              <h3 className='text-gray-500 '>Click 'Claim Offer' below to add to your account</h3>
            </li>

            <li className='flex items-center gap-1'>
              <span className='bg-pink-500 px-2 py-0.5 w-fit rounded-full text-white'>2</span>
              <h3 className='text-gray-500 '>Browse available facial treatments</h3>
            </li>

            <li className='flex items-center gap-1'>
              <span className='bg-pink-500 px-2 py-0.5 w-fit rounded-full text-white'>3</span>
              <h3 className='text-gray-500 '>Book your appointment</h3>
            </li>

            <li className='flex items-center gap-1'>
              <span className='bg-pink-500 px-2 py-0.5 w-fit rounded-full text-white'>4</span>
              <h3 className='text-gray-500 '>Discount will be automatically applied at checkout</h3>
            </li>
          </ul>


        </div>

        <div className='flex flex-col items-center mt-3 gap-1'>
          <Button className='w-full rounded-md '>Claim Offer Now</Button>
          <p className='text-gray-500 text-sm max-w-70 text-center'>Once claimed, this offer will be saved to your account and can be used anytime before expiration</p>
        </div>



        </div>

        <div className='bg-white shadow-md rounded-md p-5 lg:w-lg w-md'>

          <div>
            <h1 className='font-bold text-xl'>Terms & Conditions</h1>
          </div>

          <div>
            <ul >

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>Offer valid for facial treatments only</h2>
              </li>

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>Cannot be combined with other offers or promotions</h2>
              </li>

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>One use per customer</h2>
              </li>

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>Must be redeemed by October 31, 2024</h2>
              </li>

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>Offer is non-transferable and has no cash value</h2>
              </li>

              <li className='flex items-center gap-1'>
                <BsDot className='text-pink-500 text-lg'/>
                <h2 className='text-gray-500 text-sm'>Subject to artist availability</h2>
              </li>

            </ul>
          </div>

        </div>

          </div>
    </>
  )
}
