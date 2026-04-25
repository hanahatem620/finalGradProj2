import React from 'react'
import Image from 'next/image'
import artist from '../../../../public/images/artist.jpg'
import { FaStar } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa6";
import { Button } from '@/components/ui/button';




export default function clientFav() {
  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>My Favorites</h1>
            <p className='text-gray-500 text-sm'>Your Saved artists and services for quick booking</p>
        </div>

        <div>

        <div className='border border-gray-200 p-3 shadow-md w-xs rounded-md '>

        <div>
            <Image src={artist} alt='' width={300} height={100} className='rounded-md mx-auto aspect-video' />

        </div>

            <div className='flex flex-col gap-1 mt-2'>
                <h1 className='font-bold text-lg'>Jessica M.</h1>
            <p className='text-gray-500'>Makeup Artist</p>
            <p className='font-semibold text-pink-600'>Bridal Makeup</p>
            <p className='flex items-center gap-1 font-bold'>
                <FaStar className='text-yellow-300'/>
                5
                <span className='font-normal text-gray-500'>(142 reviews)</span>
            </p>

            <p className='flex items-center gap-1'>
                <IoLocationOutline/>
                Glam studio, Downtown
            </p>
            </div>

            <Button className='bg-pink-500 text-white w-full mt-2'>Book Now</Button>

        </div>

        </div>

     </div>

    </>
  )
}
