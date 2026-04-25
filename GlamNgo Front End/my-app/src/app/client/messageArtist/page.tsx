'use client'
import React from 'react'
import img from '../../../../public/images/artist.jpg'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { LuSendHorizontal } from "react-icons/lu";
import { LiaUploadSolid } from "react-icons/lia";
import { GrAttachment } from "react-icons/gr";
import { Textarea } from '@/components/ui/textarea'




export default function MessageArtist() {
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

    <div className='shadow-md p-5 rounded-md flex flex-col gap-5'>

        <div className='flex justify-between items-center'>
            <div className='flex gap-2'>
            <div>
                <Image src={img} alt='Artist' width={50} height={50} className='rounded-full'/>
            </div>
            <div>
                <h2 className='font-bold text-xl'>Jessica M.</h2>
                <p className='text-gray-500 text-sm'>Bridal Makeup Artist</p>
            </div>
        </div>
        <p className='text-green-400 font-bold'>. Online</p>
        </div>

        <Separator/>

        <div className='flex flex-col gap-3'>
            <div>
            <p className='bg-gray-100 p-3 rounded-md w-fit'>Hi Sarah! Thanks for booking with me. I'm excited to help you with your bridal makeup trial!</p>
            <p className='text-gray-500 text-xs mt-1'>2.30 PM</p>
        </div>

        <div className='self-end'>
            <p className='bg-pink-500 text-white p-3 rounded-md w-fit'>Thank you! I'm really looking forward to it. I was wondering if you could recommend what I should bring?</p>
            <p className='text-gray-500 text-xs mt-1 '>2.32 PM</p>
        </div>
        </div>

        <Separator/>

    <div className='flex items-center gap-2'>

        <GrAttachment className='text-gray-500 border border-gray-300 p-2 text-3xl rounded-md'/>

        <Textarea placeholder='Type your message...' className='border border-gray-300 rounded-md mt-3 '/>

        <LuSendHorizontal className='text-white bg-pink-500 p-2 rounded-md text-3xl mt-2 cursor-pointer'/>

    </div>


    </div>
        

    </div>
    
    </>
  )
}
