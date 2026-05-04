'use client'
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LuClock4 } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";





export default function ProviderSchedule() {






  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

        <div className='flex items-center justify-between'>
            <div>
                <h2 className='text-3xl font-bold'>Artist Schedule</h2>
                <p className='text-gray-500'>Manage your appointment and availability</p>
            </div>

            {/* <div className='flex gap-2'>
                <p>set availability</p>
                <p>new aapointment</p>
            </div> */}
        </div>

        <div className="bg-pink-100 p-2 rounded-md mt-3">
            <p className="text-gray-500 flex items-center"> <GoDotFill className="text-green-400"/> Your availability is  <span className="font-bold text-black ms-1 me-1"> live</span> - clients can see your open time on your public profile and in the booking flow.</p>
        </div>

    <div className="mt-4">
       <Tabs defaultValue="Calender" >
      <TabsList>
        <TabsTrigger value="Calender">Calender View</TabsTrigger>
        <TabsTrigger value="Day-view">Day View</TabsTrigger>
      </TabsList>

      <TabsContent value="Calender">
          <CardHeader className="w-md">
                <div className="border border-gray-300 p-2 rounded-md mt-4 w-fit">

        <div className="flex gap-4 mt-4">
            <div className="flex gap-1 items-center">
                <GoDotFill className="text-green-600"/>
                <p className="text-gray-600">Available Slots</p>
            </div>

            <div className="flex gap-1 items-center">
                <GoDotFill className="text-pink-500"/>
                <p className="text-gray-600">Booked</p>
            </div>

            <div className="flex gap-1 items-center">
                <GoDotFill className="text-gray-300"/>
                <p className="text-gray-600">Unavailable</p>
            </div>

        </div>

         <Calendar
         
         className="w-xl"
//       modifiers={{
//   available: (date) => availableDays.includes(date.getDay()),
//   unavailable: (date) => !availableDays.includes(date.getDay())
// }}

//       modifiersClassNames={{
//         available: 'bg-green-500 text-white',
//         unavailable: 'bg-gray-300 text-black'
//       }}
    />
    </div>
          </CardHeader>
      </TabsContent>

      <TabsContent value="Day-view" className="w-md">
        <Card>
          <CardHeader>

            <div>
                <div>
                    <h2 className="font-bold text-2xl">Today's Bookings</h2>
                </div>

                <div>
                    <div className="border border-gray-200 p-4 w-sm rounded-md mt-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                            <LuClock4 className="text-pink-500"/>
                            <p className="font-bold">10:00 AM</p>
                        </div>
                        <p className="text-gray-500">120 min</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <IoPersonOutline className="text-gray-500"/>
                        <p className="font-bold">Emma Watson</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Bridal MakeUp</p>
                    </div>

                    <div className="bg-gray-100 text-gray-500 p-2 rounded-md">
                        <p>Wedding makeup for outdoor</p>
                    </div>

                    
                </div>

                <div className="border border-gray-200 p-4 w-sm rounded-md mt-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                            <LuClock4 className="text-pink-500"/>
                            <p className="font-bold">10:00 AM</p>
                        </div>
                        <p className="text-gray-500">120 min</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <IoPersonOutline className="text-gray-500"/>
                        <p className="font-bold">Emma Watson</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Bridal MakeUp</p>
                    </div>

                    <div className="bg-gray-100 text-gray-500 p-2 rounded-md">
                        <p>Wedding makeup for outdoor</p>
                    </div>

                    
                </div>
                </div>

            </div>
            
          </CardHeader>
        </Card>
      </TabsContent>

    </Tabs>
    </div>


    </div>
    </>
  )
}
