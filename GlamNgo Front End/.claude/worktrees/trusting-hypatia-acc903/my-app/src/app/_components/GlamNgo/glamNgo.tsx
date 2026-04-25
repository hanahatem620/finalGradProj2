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
import { LuSparkles } from "react-icons/lu";
import { RiSuitcaseLine } from "react-icons/ri";
import ArtistFormBtn from "../ArtistFormBtn/ArtistFormBtn";
import BookServiceTemp from "../../BookServiceTemp/page";
import ServiceTempBtn from "../ServiceTempBtn/ServiceTempBtn";
import Link from "next/link";



export default function GlamNgo() {




  return (
    <>
    <div className='w-full'>
    <div className='container mx-auto w-[65%]'>

    <div className='Glam flex flex-col items-center py-4 text-center gap-2'>
        <p className='bg-linear-to-b from-pink-400 to-pink-500 p-2 rounded-2xl text-xs text-white font-semibold'>NEW HERE?</p>
        <h1 className='font-bold text-3xl'>Welcome to GlamNgo</h1>
        <p className='text-gray-500 max-w-145'>Whether you're looking to book a beauty service or join our talented team of artists, we're here for you</p>
    </div>

    <div className="GlamCard flex flex-col lg:flex-row gap-3">
     <Card  className="mx-auto w-full max-w-sm bg-gray-50 shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Book a Service</h3>
            <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-3 rounded-full">
            <LuSparkles className="text-white text-2xl"/>
            </div>


        </CardTitle>
        <CardDescription className="max-w-75">
          Get pampered by our professional makeup and hair artists. Perfect for weddings, events, or everyday glam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc text-pink-500 ms-4">
        <li>
            
           <span className="text-gray-500 ">Browse verified artists in your area</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Compare prices and reviews</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Book instantly with secure payment</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Try our AI makeup preview feature</span>
        </li>


        </ul>
      </CardContent>
      <CardFooter>

        {/* <Button variant="outline" size="sm" className="w-full p-5 bg-linear-to-b from-pink-400 to-pink-500 text-white rounded-full hover:bg-pink-500 hover:text-white cursor-pointer">
          Find Your Artist
        </Button> */}

        <ServiceTempBtn title='find your artist' />

      </CardFooter>
    </Card>

     <Card  className="mx-auto w-full max-w-sm bg-gray-50 shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Join as an Artist</h3>
            <div className="bg-linear-to-b from-purple-500 to-pink-500 w-fit p-3 rounded-full">
            <RiSuitcaseLine className="text-white text-2xl"/>
            </div>


        </CardTitle>
        <CardDescription className="max-w-75">
            Grow your beauty business with Glam Myfi. Connect with clients and manage bookings effortlessly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc text-purple-500 ms-4">
        <li>
            
           <span className="text-gray-500 ">Create your professional profile</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Set your own prices and schedule</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Receive instant booking notifications</span>
        </li>

        <li>
            
            <span className="text-gray-500 ">Build your client base and reputation</span>
        </li>


        </ul>
      </CardContent>
      <CardFooter className="w-full">
        <Link href={'/becomeAPro'} className="bg-linear-to-b from-purple-500 to-pink-500 text-white font-semibold p-2 flex-1 rounded-full text-center text-sm">Become an Artist</Link>
      </CardFooter>
    </Card>
    </div>

    <div className="text-center py-8 font-semibold">
        <p className="text-gray-500">Have questions <span className="text-pink-500">Contact our support team</span></p>
    </div>



    </div>
    </div>
    
    
    
    </>
  )
}
