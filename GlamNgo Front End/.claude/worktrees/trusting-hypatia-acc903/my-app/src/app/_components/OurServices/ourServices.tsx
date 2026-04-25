'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { MdOutlinePalette } from "react-icons/md";
import { PiScissors } from "react-icons/pi";
import { LuSparkles } from "react-icons/lu";
import { FaRegHand } from "react-icons/fa6";
import ServiceBookingBtn from "../ServiceBookingBtn/serviceBookingBtn";




export default function OurServices() {




  return (
   <>
   
   <div className="bg-white">
    <div className="container w-[80%] mx-auto py-4">

      <div className="py-4 flex flex-wrap justify-center gap-8">

        <Card  className="w-full max-w-sm bg-linear-to-r from-pink-50  to-purple-50 border-0 shadow">
      <CardHeader className="flex items-center">

        <div className="bg-linear-to-b from-pink-400 to-pink-500 p-3 rounded-xl">
            <MdOutlinePalette className="text-2xl text-white"/>
        </div>

        <div className="servText">
            <CardTitle className="mb-1">Bridal Makeup</CardTitle>
        <CardDescription>
          Stunning bridal looks for your special day
        </CardDescription>
        </div>

      </CardHeader>
      <CardContent>
        <ul className="list-disc text-pink-500 ms-15">
            <li><span className="text-gray-500">Airbrush application</span></li>
            <li><span className="text-gray-500">False lashes</span></li>
            <li><span className="text-gray-500">Trial session</span></li>
            <li><span className="text-gray-500">Touch-up kit</span></li>
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-pink-500 font-bold ms-10 text-xl">From 1000 EGP</p>

        <div className="w-fit">
          <ServiceBookingBtn title="Book Now" />
        </div>

      </CardFooter>
    </Card>

      <Card  className="w-full max-w-sm bg-linear-to-r from-pink-50  to-purple-50 shadow border-0">
      <CardHeader className="flex items-center">

        <div className="bg-linear-to-b from-pink-400 to-pink-500 p-3 rounded-xl">
            <PiScissors  className="text-2xl text-white"/>
        </div>

        <div className="servText">
            <CardTitle className="mb-1">Hair Styling</CardTitle>
        <CardDescription>
          Professional hairstyling and updos
        </CardDescription>
        </div>

      </CardHeader>
      <CardContent>
        <ul className="list-disc text-pink-500 ms-15">
            <li><span className="text-gray-500">Wedding updos</span></li>
            <li><span className="text-gray-500">Blowouts</span></li>
            <li><span className="text-gray-500">Braiding</span></li>
            <li><span className="text-gray-500">Hair extensions</span></li>
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-pink-500 font-bold ms-10 text-xl">From 500 EGP</p>
        <Button variant="outline" size="sm" className=" border-pink-500 cursor-pointer hover:text-pink-500 hover:bg-white text-pink-500 rounded-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>

      <Card  className="w-full max-w-sm bg-linear-to-r from-pink-50  to-purple-50 shadow border-0">
      <CardHeader className="flex items-center">

        <div className="bg-linear-to-b from-pink-400 to-pink-500 p-3 rounded-xl">
            <LuSparkles  className="text-2xl text-white"/>
        </div>

        <div className="servText">
            <CardTitle className="mb-1">Event Makeup</CardTitle>
        <CardDescription>
          Glamorous looks for special occasions
        </CardDescription>
        </div>

      </CardHeader>
      <CardContent>
        <ul className="list-disc text-pink-500 ms-15">
            <li><span className="text-gray-500">Party makeup</span></li>
            <li><span className="text-gray-500">Photoshoot ready</span></li>
            <li><span className="text-gray-500">Long-lasting</span></li>
            <li><span className="text-gray-500">Custom looks</span></li>
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-pink-500 font-bold ms-10 text-xl">From 600 EGP</p>
        <Button variant="outline" size="sm" className=" border-pink-500 cursor-pointer hover:text-pink-500 hover:bg-white text-pink-500 rounded-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>

      <Card  className="w-full max-w-sm bg-linear-to-r from-pink-50  to-purple-50 shadow border-0">
      <CardHeader className="flex items-center">

        <div className="bg-linear-to-b from-pink-400 to-pink-500 p-3 rounded-xl">
            <FaRegHand className="text-2xl text-white"/>
        </div>

        <div className="servText">
            <CardTitle className="mb-1">Manicure & Pedicure</CardTitle>
        <CardDescription>
        Professional nail care and design
        </CardDescription>
        </div>

      </CardHeader>
      <CardContent>
        <ul className="list-disc text-pink-500 ms-15">
            <li><span className="text-gray-500">Gel polish</span></li>
            <li><span className="text-gray-500">Nail art</span></li>
            <li><span className="text-gray-500">Spa treatment</span></li>
            <li><span className="text-gray-500">French tips</span></li>
        </ul>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-pink-500 font-bold ms-10 text-xl">From 250 EGP</p>
        <Button variant="outline" size="sm" className=" border-pink-500 cursor-pointer hover:text-pink-500 hover:bg-white text-pink-500 rounded-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>


      </div>
    
    </div>
   </div>
   
   
   </>
  )
}
