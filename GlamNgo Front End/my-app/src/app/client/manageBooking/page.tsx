import Image from 'next/image'
import React from 'react'
import artist from '../../../../public/images/artist.jpg'
import { Badge } from "@/components/ui/badge"
import { MdDateRange } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import Link from 'next/link';




export default function ManageBooking() {
  return (
    
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>
        <div>
            <h1 className='font-bold text-3xl'>Manage Booking</h1>
        </div>

        <div className='flex flex-col lg:flex-row gap-3'>

        <div className='lg:w-[50%]'>
            <div className='bg-white shadow-md rounded-md p-5'>
            <div className='flex gap-2'>
                <div>
                    <Image src={artist} width={70} height={70} className='rounded-full object-cover'
                    alt=''/>
                </div>

                <div>
                    <h1 className='font-bold text-xl'>Jessica M.</h1>
                    <h2 className='font-bold text-pink-500'>Bridal Makeup Trial</h2>
                    <div>
                       <Badge className='bg-green-200 text-green-600 '>Confirmed</Badge>
                    </div>
                </div>
            </div>

        <div>
            <ul>
                <li>
                    <span className='flex items-center text-gray-500 text-sm'><MdDateRange className='me-1'/> Date</span>
                    <h3 className='ms-4 font-bold'>October 15, 2026</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><MdAccessTime className='me-1'/> Time</span>
                    <h3 className='ms-4 font-bold'>10:00 AM - 11:30 AM</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><CiLocationOn className='me-1'/>Location</span>
                    <h3 className='ms-4 font-bold'>Glam Studio, Downtown</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><HiDotsVertical className='me-1'/> Duration</span>
                    <h3 className='ms-4 font-bold'>1.5 hours</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><IoPersonOutline className='me-1'/>Price</span>
                    <h3 className='ms-4 font-bold'>$125.00</h3>
                </li>

            </ul>
        </div>

        </div>
        </div>

        <div className='lg:w-[50%]'>
            <div className='bg-white shadow-md rounded-md p-5 flex flex-col text-center'>
                <Link href={"/"} className='text-pink-500 font-bold'>Message artist</Link>
                <Link href={"/"} className='text-pink-500 font-bold ms-5'>Reschedule</Link>
                <Link href={"/"} className='text-pink-500 font-bold ms-5'>Add to calendar</Link>
                <Link href={"/"} className='text-pink-500 font-bold ms-5'>Cancel booking</Link>
        </div>

        <div className='bg-pink-300 p-5 mt-3 rounded-md'>
            <h3 className='font-semibold'>Cancellation Policy</h3>
            <p className='text-gray-500 text-sm'>Free cancellation up to 24 hours before your appointment.</p>
            <p className='text-gray-500 text-sm'>Late cancellations may incur a $25 fee.</p>
        </div>
        </div>


        </div>
     </div>
    </>
  )
}
