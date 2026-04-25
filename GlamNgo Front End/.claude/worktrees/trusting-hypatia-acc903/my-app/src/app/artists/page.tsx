'use client'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { BsDot } from "react-icons/bs";
import { Separator } from "@/components/ui/separator"


import artistPhoto from '../../../public/images/artistPhoto.png'
import Image from 'next/image'
import ArtistPortolioBtn from '../_components/ArtistPortolioBtn/ArtistPortolioBtn';
import { getAllServices } from '@/allServicesActions/getAllServices.action';
import { useEffect, useState } from 'react';
import { allServices } from '@/types/allServices.type';



export default function Artists() {

const [services , setServices] = useState<any>(null)
// const id = 2

async function getArtists(id : number){
  const res = await getAllServices(id)
  setServices(res)
  console.log(res)
}

// useEffect(() => {
// function flag(){
//  getArtists(id)
// }
// flag()
// },[id])




  return (
    <>
    <div className='py-4 w-full '>
        <div className='container w-[80%] mx-auto'>

        <div className='artistsText flex justify-between items-center'>
            <div>
                <h1 className='font-bold text-3xl'>Artists</h1>
            <p className='text-gray-500'>Top-related professionals ready to serve you</p>
            </div>

            <div>
                <Button variant="ghost" className='text-pink-500 cursor-pointer hover:bg-none hover:text-pink-500'>view All artists &gt;  </Button>
            </div>
        </div>

        <div className='artistCard flex flex-col lg:flex-row items-center gap-3 py-3'>

            <Card className="relative w-full max-w-xs pt-0 overflow-hidden flex gap-2">
              <div className="absolute inset-0 z-30 aspect-video " />
              <Image
                src={artistPhoto}
                alt="Event cover"
                className="relative z-20 w-full object-cover aspect-video"
              />
        
            <div>
                <p className="bg-white w-fit p-1 rounded-2xl text-black font-semibold absolute z-30 top-3 right-3 text-xs flex items-center gap-1 px-2">
                    <i className="fa-solid fa-star text-yellow-300"></i>
                    <span>4.9</span>
                    </p>
            </div>

              <CardHeader className='flex flex-col gap-3'>
                <CardTitle className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Maya Kamal</h3>
                    <div className='flex text-gray-500 text-xs'>
                        <span>Makeup artist</span>
                        <BsDot />
                        <span> New Cairo, Cairo</span>

                    </div>

                </CardTitle>

                <CardDescription className='flex flex-col gap-3'>
                
                <div className='flex gap-2'>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Bridal Makeup</p>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Hijab colors</p>
                </div>

                <div className='flex items-center'>
                <i className="fa-solid fa-map-pin text-red-600 text-sm"></i>
                <p className='text-gray-500 '>Madinty</p>
                </div>

                </CardDescription>

 <Separator />
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <p className='font-bold text-pink-500 text-xl'>1000 EGP</p>
                <ArtistPortolioBtn/>
              </CardFooter>
            </Card>

            <Card className="relative w-full max-w-xs pt-0 overflow-hidden flex gap-2">
              <div className="absolute inset-0 z-30 aspect-video " />
              <Image
                src={artistPhoto}
                alt="Event cover"
                className="relative z-20 w-full object-cover aspect-video"
              />
        
            <div>
                <p className="bg-white w-fit p-1 rounded-2xl text-black font-semibold absolute z-30 top-3 right-3 text-xs flex items-center gap-1 px-2">
                    <i className="fa-solid fa-star text-yellow-300"></i>
                    <span>4.9</span>
                    </p>
            </div>

              <CardHeader className='flex flex-col gap-3'>
                <CardTitle className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Maya Kamal</h3>
                    <div className='flex text-gray-500 text-xs'>
                        <span>Makeup artist</span>
                        <BsDot />
                        <span> New Cairo, Cairo</span>

                    </div>

                </CardTitle>

                <CardDescription className='flex flex-col gap-3'>
                
                <div className='flex gap-2'>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Bridal Makeup</p>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Hijab colors</p>
                </div>

                <div className='flex items-center'>
                <i className="fa-solid fa-map-pin text-red-600 text-sm"></i>
                <p className='text-gray-500 '>Madinty</p>
                </div>

                </CardDescription>

 <Separator />
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <p className='font-bold text-pink-500 text-xl'>1000 EGP</p>
                <Button className="bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full ">Book Now</Button>
              </CardFooter>
            </Card>

            <Card className="relative w-full max-w-xs pt-0 overflow-hidden flex gap-2">
              <div className="absolute inset-0 z-30 aspect-video " />
              <Image
                src={artistPhoto}
                alt="Event cover"
                className="relative z-20 w-full object-cover aspect-video"
              />
        
            <div>
                <p className="bg-white w-fit p-1 rounded-2xl text-black font-semibold absolute z-30 top-3 right-3 text-xs flex items-center gap-1 px-2">
                    <i className="fa-solid fa-star text-yellow-300"></i>
                    <span>4.9</span>
                    </p>
            </div>

              <CardHeader className='flex flex-col gap-3'>
                <CardTitle className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Maya Kamal</h3>
                    <div className='flex text-gray-500 text-xs'>
                        <span>Makeup artist</span>
                        <BsDot />
                        <span> New Cairo, Cairo</span>

                    </div>

                </CardTitle>

                <CardDescription className='flex flex-col gap-3'>
                
                <div className='flex gap-2'>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Bridal Makeup</p>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Hijab colors</p>
                </div>

                <div className='flex items-center'>
                <i className="fa-solid fa-map-pin text-red-600 text-sm"></i>
                <p className='text-gray-500 '>Madinty</p>
                </div>

                </CardDescription>

 <Separator />
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <p className='font-bold text-pink-500 text-xl'>1000 EGP</p>
                <Button className="bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full ">Book Now</Button>
              </CardFooter>
            </Card>

            <Card className="relative w-full max-w-xs pt-0 overflow-hidden flex gap-2">
              <div className="absolute inset-0 z-30 aspect-video " />
              <Image
                src={artistPhoto}
                alt="Event cover"
                className="relative z-20 w-full object-cover aspect-video"
              />
        
            <div>
                <p className="bg-white w-fit p-1 rounded-2xl text-black font-semibold absolute z-30 top-3 right-3 text-xs flex items-center gap-1 px-2">
                    <i className="fa-solid fa-star text-yellow-300"></i>
                    <span>4.9</span>
                    </p>
            </div>

              <CardHeader className='flex flex-col gap-3'>
                <CardTitle className='flex flex-col gap-2'>
                    <h3 className='font-bold'>Maya Kamal</h3>
                    <div className='flex text-gray-500 text-xs'>
                        <span>Makeup artist</span>
                        <BsDot />
                        <span> New Cairo, Cairo</span>

                    </div>

                </CardTitle>

                <CardDescription className='flex flex-col gap-3'>
                
                <div className='flex gap-2'>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Bridal Makeup</p>
                    <p className='bg-pink-100 p-1 rounded-full text-pink-500'>Hijab colors</p>
                </div>

                <div className='flex items-center'>
                <i className="fa-solid fa-map-pin text-red-600 text-sm"></i>
                <p className='text-gray-500 '>Madinty</p>
                </div>

                </CardDescription>

 <Separator />
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <p className='font-bold text-pink-500 text-xl'>1000 EGP</p>
                <Button className="bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full ">Book Now</Button>
              </CardFooter>
            </Card>

        </div>


        </div>
    </div>
    
    
    
    </>
  )
}
