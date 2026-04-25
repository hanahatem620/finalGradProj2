'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import bundle1 from "../../../../public/images/bundel1.jpg"
import bundle2 from "../../../../public/images/bundel2.jpg"
import bundle3 from "../../../../public/images/bundel3.jpg"

import Image from "next/image"
import BookingBtn from "../AppointBookingBtn/appointBookingBtn"


export default function Bundels() {





  return (
   <>
   <div className=' w-full py-4'>

            <div className="flex flex-col items-center py-3 text-center">
            <h1 className="font-bold text-3xl">Hair & Makeup Bundles</h1>
            <p className="text-gray-500">Choose the perfect package for your special occasion</p>
        </div>

    <div className='container w-[80%] mx-auto flex flex-col lg:flex-row gap-3'>

    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden flex">
      <div className="absolute inset-0 z-30 aspect-video " />
      <Image
        src={bundle1}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-75 "
      />

    <div>
        <p className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-1 rounded-2xl text-white font-semibold absolute z-30 top-3 right-3 text-xs">Most popular</p>
    </div>

      <div className="absolute z-30 text-white top-36 left-3">
        <h3 className="font-bold text-xl">Bridal Glam Package</h3>
        <p className="text-xs">Complete bridal transformation</p>
      </div>
      <CardHeader>
        <CardTitle className="text-3xl text-pink-500 font-bold">1500 EGP</CardTitle>
        <CardDescription>
          <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Professional bridal makeup</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Hair styling & updo</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Airbrush makeup application</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>False lashes included</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Makeup touch-up kit</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Trial session included</span>
        </li>


          </ul>
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        {/* <Button className="w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full ">Book Now</Button> */}
      <BookingBtn/>
      </CardFooter>
    </Card>

    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden flex">
      <div className="absolute inset-0 z-30 aspect-video " />
      <Image
        src={bundle2}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-70 "
      />
       <div className="absolute z-30 text-white top-36 left-3">
        <h3 className="font-bold text-xl">Event Ready Bundle</h3>
        <p className="text-xs">Perfect for special occasions</p>
      </div>
      <CardHeader>
        <CardTitle className="text-3xl text-pink-500 font-bold">850 EGP</CardTitle>
        <CardDescription>
          <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Glamorous makeup look</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Professional hair styling</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Contouring & highlighting</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>False lashes</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Setting spray application</span>
        </li>

          </ul>
        </CardDescription>
      </CardHeader>

           <CardFooter className="mt-auto">
        <Button className="w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full">Book Now</Button>
      </CardFooter>
    </Card>

    <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden flex">
      <div className="absolute inset-0 z-30 aspect-video" />
      <Image
        src={bundle3}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-80"
      />
       <div className="absolute z-30 text-white top-36 left-3">
        <h3 className="font-bold text-xl">Hair & Makeup Express</h3>
        <p className="text-xs">Quick glam for busy schedules</p>
      </div>

       <CardHeader>
        <CardTitle className="text-3xl text-pink-500 font-bold">500 EGP</CardTitle>
        <CardDescription>
          <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Natural makeup look</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Basic hair styling</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Blow-dry included</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Quick & efficient service</span>
        </li>

          </ul>
        </CardDescription>
      </CardHeader>


         <CardFooter className="mt-auto">
        <Button className="w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full">Book Now</Button>
      </CardFooter>
    </Card>



    </div>
   </div>
   
   
   
   
   </>
  )
}
