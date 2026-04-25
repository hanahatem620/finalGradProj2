'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FiClock } from "react-icons/fi";
import Image from 'next/image'
import { LuCalendarCheck2 } from "react-icons/lu";

export default function clientSchedule() {




  return (
    <>
<div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

    <div className="flex justify-between">
        <div>
            <h1 className="font-bold text-3xl">My Schedule</h1>
            <p>View Your upcoming appointment in calendar format</p>
        </div>

        <div className="flex flex-col gap-1">
            <Button className="bg-white border border-pink-500 text-gray-600">Calender view</Button>
            <Button className="text-white bg-pink-500">Add new Booking</Button>
        </div>
    </div>

    <div>

        <div className='flex flex-wrap gap-5'>
              
                      <div className='bg-white shadow-md rounded-md w-full p-4 flex gap-2'>

                            <div className='flex flex-col text-center w-fit h-fit bg-pink-300 rounded-md p-3'>
                             <h1 className="font-bold text-xl">21</h1>
                             <p className="text-gray-500 text-sm">Monday</p>
                             <p className="text-gray-400 text-xs">Oct. 2024</p>
                          </div>
                              
                            <div className="border border-gray-100 rounded-md p-2 flex-1">

                                <div className="flex justify-between">
                                <div>
                                  <h1 className='text-md font-bold flex items-center gap-1'><FiClock />
                                  10:00 AM - 11:30 AM
                                  </h1>
                                  <p className='text-sm text-pink-500 font-bold'>Bridal Makeup Trial</p>
                                  <p className="text-sm text-gray-500">with Jessica M. • Glam Studio, Downtown</p>
                              </div>

                                <div>
                                  <Badge className='text-green-500 bg-green-200'>Confirmed</Badge>
                                </div>
                            </div>
              
                        <div className='flex gap-2 mt-3'>
                           <Button className='bg-pink-200 text-pink-500 rounded-md flex-3 '>Message artist</Button>
                           <Button className='bg-white border border-gray-300 text-black'>Reschedule</Button>
                          </div>      
                      </div>
                            </div>
              
                     
              
                      </div>
    </div>

</div>
    
    </>
  )
}
