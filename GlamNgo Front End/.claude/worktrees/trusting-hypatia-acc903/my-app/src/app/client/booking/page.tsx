'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import artist from '../../../../public/images/artist.jpg'
import { Badge } from "@/components/ui/badge"
import { FiClock } from "react-icons/fi";
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { LuCalendarCheck2 } from "react-icons/lu";
import Link from "next/link";


export default function ClientBooking() {
  return (
<>

<div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

<div>
    <h1 className='font-bold text-2xl'>My Bookings</h1>
    <p className='text-gray-500 text-sm'>Manage your upcoming and past appointments</p>
</div>

<div>
  <Tabs defaultValue="UpComing">
      <TabsList variant="line" className='mb-5'>
        <TabsTrigger value="UpComing">Upcoming</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>

    <TabsContent value='UpComing'>
      <div className='flex flex-wrap gap-5'>
      
              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
      
                <div className='flex gap-2 '>
                   <Button className='bg-pink-500 text-white rounded-md flex-3 '>
                    <Link href='/client/messageArtist'>Message artist</Link>
                   </Button>
                   <Button className='bg-white border border-gray-300 text-black'>
                    <Link href='/client/rescheduleAppointment'>Reschedule</Link>
                   </Button>
                  </div>      
              </div>
      
              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
                          <Badge className='text-yellow-500 bg-yellow-200'>Pending confirmation</Badge>
                        </div>
      
      
                  </div>
      
                 <div className='mt-4'>
                   <h2 className='flex items-center gap-1 text-gray-500'><LuCalendarCheck2/>Tomorrow, 10:00 AM - 11:30 AM</h2>
                  <h2 className='flex items-center gap-1 text-gray-500'><FiClock/>Glam Studio, Downtown</h2>
                 </div>
      
                <div className='flex gap-2'>
                      <Button className='bg-white border border-gray-500 text-black rounded-md flex-2'>View details</Button>
                      <Button className='bg-white border border-pink-500 text-pink-500'>cancel Request</Button>
                  </div>      
              </div>
      
              </div>

    </TabsContent>

 <TabsContent value='completed'>
      <div className='flex flex-wrap gap-5'>
      
              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
                          <Badge className='text-green-500 bg-green-200'>Completed</Badge>
                        </div>
      
      
                  </div>
      
                 <div className='mt-4'>
                   <h2 className='flex items-center gap-1 text-gray-500'><LuCalendarCheck2/>Tomorrow, 10:00 AM - 11:30 AM</h2>
                  <h2 className='flex items-center gap-1 text-gray-500'><FiClock/>Glam Studio, Downtown</h2>
                 </div>
      
                <div className='flex gap-2 '>
                   <Button className='bg-pink-500 text-white rounded-md flex-3 '>Leave Review</Button>
                   <Button className='bg-white text-pink-500 border border-pink-500'>Book Again</Button>
                  </div>      
              </div>

              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
      
                <div className='flex gap-2 '>
                   <Button className='bg-pink-500 text-white rounded-md flex-3 '>Message artist</Button>
                   <Button className='bg-white text-pink-500 border border-pink-500'>Book Again</Button>
                  </div>      
              </div>

              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
      
                <div className='flex gap-2 '>
                   <Button className='bg-white border border-gray-500 flex-1 text-black '>review posted</Button>
                   <Button className='bg-white text-pink-500 border border-pink-500'>Book Again</Button>
                  </div>      
              </div>
      
              
      
              </div>

    </TabsContent>

    <TabsContent value='cancelled'>
      <div className='flex flex-wrap gap-5'>
      
              <div className='bg-white shadow-md rounded-md w-full p-4'>
      
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
                          <Badge className='text-red-500 bg-red-200'>cancelled</Badge>
                        </div>
      
      
                  </div>
      
                 <div className='mt-4'>
                   <h2 className='flex items-center gap-1 text-gray-500'><LuCalendarCheck2/>Tomorrow, 10:00 AM - 11:30 AM</h2>
                  <h2 className='flex items-center gap-1 text-gray-500'><FiClock/>Glam Studio, Downtown</h2>
                 </div>

                 <div className='bg-gray-100 p-3 container rounded-md flex justify-between mt-2 mb-2'>

                    <div className='flex flex-col'>
                    <p className='text-gray-500'>Cancelled by</p>
                    <h2 className='text-black font-bold'>You</h2>
                  </div>

                  <div className='flex flex-col'>
                    <p className='text-gray-500'>Reason</p>
                    <h2 className='text-black font-bold'>schedule conflict</h2>
                  </div>

                  <div className='flex flex-col'>
                    <p className='text-gray-500'>Refund status</p>
                    <h2 className='text-green-400 font-bold'>Refunded</h2>
                  </div>

                


                 </div>
      
                <div className='flex gap-2 '>
                   <Button className='bg-pink-500 text-white rounded-md flex-3 '>Book again</Button>
                   <Button className='bg-white border border-gray-300 text-black'>View details</Button>
                  </div>      
              </div>

      
              </div>

    </TabsContent>


    </Tabs>
</div>




</div>


</>
)
}
