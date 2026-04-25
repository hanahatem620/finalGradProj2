'use client'
import { Button } from '@/components/ui/button';
import { BiGift } from "react-icons/bi";
import { IoIosStarOutline } from "react-icons/io";
import { LuCalendar } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";




export default function ClientNotification() {
  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>Notifications</h1>
        </div>

        <div>
            <h3 className='font-semibold text-gray-500 text-sm mb-3'>YESTERDAY</h3>

               <div className='flex flex-col gap-2'>
                 <div className='firstNotif'>

                    <div className='border border-gray-200 p-5 rounded-md shadow-sm flex gap-2'>

                        <div className='bg-green-200 text-green-500 w-fit h-fit p-2 rounded-full'>
                            <BiGift className='text-lg' />
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <h2 className='font-bold'>New Offer</h2>
                            <p className='text-gray-500'>Get 20% off your next facial treatment. Valid until Oct 31, 2024.</p>
                            <p className='text-gray-400 text-sm'>Yesterday at 2:30 PM</p>
                            <Button className='w-fit'>Claim Offer</Button>
                        </div>

                    </div>

                </div>

                <div className='firstNotif'>

                    <div className='border border-gray-200 p-5 rounded-md shadow-sm flex gap-2'>

                        <div className='bg-yellow-100 text-yellow-500 w-fit h-fit p-2 rounded-full'>
                            <LuCalendar className='text-lg' />
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <h2 className='font-bold'>Booking Request Sent</h2>
                            <p className='text-gray-500'>Your hair coloring request with Alex R. is pending confirmation for Oct 24 at 2:00 PM.</p>
                            <p className='text-gray-400 text-sm'>Yesterday at 11:15 AM</p>
                        </div>

                    </div>

                </div>

                <div className='firstNotif'>

                    <div className='border border-gray-200 p-5 rounded-md shadow-sm flex gap-2'>

                        <div className='bg-blue-200 text-blue-700 w-fit h-fit p-2 rounded-full'>
                            <IoIosStarOutline className='text-lg' />
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <h2 className='font-bold'>Loyalty Points Earned!</h2>
                            <p className='text-gray-500'>You earned 25 points from your recent gel manicure with Lisa K. Total: 350 points.</p>
                            <p className='text-gray-400 text-sm'>Yesterday at 9:00 AM</p>
                        </div>

                    </div>

                </div>
               </div>


        </div>

        <div>
            <h3 className='font-semibold text-gray-500 text-sm mb-3'>This week</h3>

               <div className='flex flex-col gap-2'>

                <div className='firstNotif'>

                    <div className='border border-gray-200 p-5 rounded-md shadow-sm flex gap-2'>

                        <div className='bg-pink-200 text-pink-500 w-fit h-fit p-2 rounded-full'>
                            <IoIosStarOutline className='text-lg' />
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <h2 className='font-bold'>Reminder: Leave a Review</h2>
                            <p className='text-gray-500'>How was your gel manicure with Lisa K.? Share your experience to help others.</p>
                            <p className='text-gray-400 text-sm'>Oct 11 at 3:00 PM</p>
                            <Button className='bg-white border border-gray-300 text-black w-fit mt-1'>Write Review</Button>
                        </div>

                    </div>

                </div>

                 <div className='firstNotif'>

                    <div className='border border-gray-200 p-5 rounded-md shadow-sm flex gap-2'>

                        <div className='bg-green-200 text-green-500 w-fit h-fit p-2 rounded-full'>
                            <FaRegCircleCheck className='text-lg' />
                        </div>

                        <div className='flex flex-col gap-0.5'>
                            <h2 className='font-bold'>Booking Completed</h2>
                            <p className='text-gray-500'>Your hydrating facial with Dr. Emma S. has been completed. Hope you enjoyed it!</p>
                            <p className='text-gray-400 text-sm'>Sep 24 at 5:30 PM</p>
                        </div>

                    </div>

                </div>

               </div>


        </div>

     </div>
    
    </>
  )
}
