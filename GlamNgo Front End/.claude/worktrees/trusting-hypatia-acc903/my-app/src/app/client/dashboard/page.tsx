'use client'
import { useEffect, useState } from 'react'
import { LuCalendarCheck2 } from "react-icons/lu";
import { FaStar } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import artist from '../../../../public/images/artist.jpg'
import { Badge } from "@/components/ui/badge"
import { FiClock } from "react-icons/fi";
import Link from 'next/link';
import { getUser } from '@/profileActions/getUser.action';
import { log } from 'console';
import { User } from '@/types/user.type';




export default function ClientDashboard() {

    const [user, setUser] = useState<User | null>(null)


async function getLoggedUser(){
    const res = await getUser()
    setUser(res)
    // console.log(res);


}

useEffect(() => {
function flag(){
  getLoggedUser()
}
flag()
},[])



  return (
    <>
     <div className='container lg:w-[80%] w-[90%]  mx-auto py-10 flex flex-col gap-5'>

        <div className='firstCard'>
            <h1 className='text-3xl font-bold mb-5'>Hello, <span className='text-pink-500'>{user?.name}</span> ! Ready to glow?</h1>

            <div className='flex flex-wrap gap-3'>

                <div className='bg-white shadow-md w-fit p-5 border border-gray-200 rounded-md flex gap-3 '>
                <div>
                    <p className='text-gray-500'>Total Bookings</p>
                    <h1 className='font-bold text-2xl'>12</h1>
                </div>

                <div className='bg-pink-200 p-2 rounded-sm h-fit'>
                <LuCalendarCheck2 className='text-pink-500 text-2xl'/>

                </div>

            </div>

                <div className='bg-white shadow-md w-fit p-5 border border-gray-200 rounded-md flex gap-3 '>
                <div>
                    <p className='text-gray-500'>Loyalty Booking</p>
                    <h1 className='font-bold text-2xl'>350 <span className='font-normal text-sm'>pts</span></h1>
                </div>

                <div className='bg-pink-200 p-2 rounded-sm h-fit'>
                <FaStar className='text-pink-500 text-2xl'/>

                </div>

            </div>

             <div className='bg-pink-300 shadow-md w-fit pt-5 pb-10 px-10 rounded-md flex flex-col gap-3 '>
                <div>
                    <h1 className='font-bold'>New Offers</h1>
                    <p className='max-w-35 text-sm text-gray-500'>Get 20% off your next facial.</p>
                    
                </div>
                <Button>
                    <Link href={"/client/claimNow"} >Claim Now</Link>
                </Button>

            </div>
            



            </div>
        </div>

        <div className='secCard'>
        <div className='flex  justify-between '>
            <h1 className='text-3xl font-bold mb-5'>Upcoming Bookings</h1>
            <p >View Calender</p>
        </div>

        <div className='flex flex-wrap gap-5'>

        <div className='bg-white shadow-md rounded-md w-md p-4'>

            <div className='flex justify-between'>
                <div className='flex gap-1 '>
                <Image src={artist} width={50} height={50} className='rounded-full'
                alt=''/>

                <div>
                    <h1 className='text-lg font-bold'>Jessica M.</h1>
                    <p className='text-sm text-pink-500 font-bold'>Bridal Makeup Trial</p>
                </div>
            </div>

                  <div>
                    <Badge className='text-green-500 bg-green-200'>Confirmed</Badge>
                  </div>


            </div>

           <div className='mt-4'>
             <h2 className='flex items-center gap-1 text-gray-500'><LuCalendarCheck2/>Tomorrow, 10:00 AM - 11:30 AM</h2>
            <h2 className='flex items-center gap-1 text-gray-500'><FiClock/>Glam Studio, Downtown</h2>
           </div>
            <Button className='bg-pink-200 text-pink-600 rounded-md w-full mt-3'>
            <Link href={"/client/manageBooking"}>Manage Booking</Link>
            </Button>

        </div>

        <div className='bg-white shadow-md rounded-md w-md p-4'>

            <div className='flex justify-between'>
                <div className='flex gap-1 '>
                <Image src={artist} width={50} height={50} className='rounded-full'
                alt=''/>

                <div>
                    <h1 className='text-lg font-bold'>Jessica M.</h1>
                    <p className='text-sm text-pink-500 font-bold'>Bridal Makeup Trial</p>
                </div>
            </div>

                  <div>
                    <Badge className='text-yellow-500 bg-yellow-200'>pending</Badge>
                  </div>


            </div>

           <div className='mt-4'>
             <h2 className='flex items-center gap-1 text-gray-500'><LuCalendarCheck2/>Tomorrow, 10:00 AM - 11:30 AM</h2>
            <h2 className='flex items-center gap-1 text-gray-500'><FiClock/>Glam Studio, Downtown</h2>
           </div>

           <Button className='bg-gray-200 text-gray-600 rounded-md w-full mt-3 cursor-pointer'>
            <Link href={"/client/bookingDetails"}>View Details</Link>
           </Button>

        </div>

        </div>

        </div>

        <div className='thirdCard'>
        <h1 className='text-3xl font-bold mb-5'>Recent History</h1>
        <div>

        <div className='bg-white p-4 shadow-md rounded-md'>
            
         <div className='flex justify-between'>
                <div className='flex gap-1 '>
                <Image src={artist} width={50} height={50} className='rounded-full'
                alt=''/>

                <div>
                    <h1 className='text-lg font-bold'>Bridal Makeup Trial</h1>
                    <p className='text-sm'>with Lisa K. OCT 10</p>
                </div>
            </div>

                  <div className='flex gap-2'>
                    <Button className='text-black border border-gray-200 bg-white'>
                    <Link href={"/client/leaveReview"}>Leave Review</Link>
                    </Button>
                    <Button>
                        <Link href={"/client/bookAppointment"}>Rebook</Link>
                    </Button>
                  </div>


            </div>
        </div>


        </div>
        </div>
   

    </div>
    </>
  )
}
