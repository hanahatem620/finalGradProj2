'use client'
import Image from 'next/image'
import img from '../../../../public/images/artist1.jpg'
import { Badge } from "@/components/ui/badge"
import { MdDateRange } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import { FaStar } from "react-icons/fa6";


export default function BookingDetails() {
  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>
        <div>
            <h1 className='font-bold text-3xl'>Booking Details</h1>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>

        <div className='lg:w-[50%]'>

            <div className='bg-white p-5 rounded-md shadow-md'>
            <div className='flex gap-2'>
                <div>
                    <Image src={img} width={100} height={100} className='rounded-full object-cover' alt=''/>
                </div>

                <div>
                    <h1 className='font-bold text-lg'>Alex R. </h1>
                    <p className='text-gray-500 text-sm'>Hair coloring & cut</p>
                    <Badge className='bg-yellow-200 text-yellow-500'>Pending confirmation</Badge>
                </div>

            </div>

            <div className='bg-yellow-200 border border-amber-400 p-2 rounded-md text-yellow-500 mt-3 flex items-center gap-2 text-sm'>
                <i className="fa-solid fa-star"></i>
                <p>Waiting for artist confirmation. You'll be notified once the artist accepts your booking request.</p>
            </div>

            <div className='mt-3'>
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


            </ul>
            </div>

            </div>

            <div className='bg-white rounded-md shadow-md p-5 flex flex-col gap-3 mt-5'>
                <div>
                    <h1 className='font-bold text-2xl'>Service Details</h1>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Service</h3>
                    <p className='font-bold '>Hair Coloring & Cut</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Description</h3>
                    <p className='font-bold '>Professional hair coloring service with a precision cut. Includes consultation, color application, styling, and aftercare advice. Perfect for a fresh new look or maintaining your current style.</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Duration</h3>
                    <p className='font-bold '>2 hours</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Price</h3>
                    <p className='font-bold '>$185.00</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>What's included</h3>

                    <div>
                         <ul className="flex flex-col gap-1">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Color consultation</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Premium color application</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Precision haircut</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Styling & blow dry</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Hair care product samples</span>
        </li>

          </ul>
                    </div>
                </div>

            </div>

        </div>

        <div className='lg:w-[50%]'>
            <div className='flex lg:flex-col flex-col-reverse  gap-2'>

            <div className='bg-white p-5 shadow-md rounded-md'>
                <h1 className='font-bold mb-2'>Actions</h1>

                <div className='flex flex-col gap-2 '>
                    <p className='bg-pink-500 p-2 text-white font-semibold w-xs text-center rounded-md'>Contact Artist</p>
                    <Button className='border border-gray-300 bg-white w-xs text-black'>Modify Request</Button>
                    <Button className='border border-gray-300 bg-white w-xs text-black'>Cancel Request</Button>
                </div>

            </div>

            <div className='bg-white p-5 shadow-md rounded-md flex flex-col gap-2'>
                <h1 className='font-bold'>About Alex</h1>
                <div className='flex items-center gap-2'>
                    <FaStar className='text-yellow-300'/>
                    <p className='font-bold '>4.9</p>
                    <p className='text-gray-500'>(98 reviews)</p>
                </div>

                    <p className='text-gray-500 max-w-85'>Professional hair stylist with 10+ years of experience specializing in color treatments and precision cuts.</p>
                    <p className='text-pink-500 font-bold'>View Full Profile</p>
            </div>

            </div>
        </div>


        </div>
     </div>
    </>
  )
}
