'use client'
import Image from 'next/image'
import portfolio from '../../../public/images/portfolio.jpg'
import { Button } from '@/components/ui/button'
import { LuMessageCircle } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import portfollio1 from '../../../public/images/portfolio1.jpg'
import portfollio2 from '../../../public/images/portfolio2.jpg'
import portfollio3 from '../../../public/images/portfolio3.jpg'
import portfollio4 from '../../../public/images/portfolio4.jpg'
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PaymentOptionSec from '../_components/BookingSteps/PaymentOptionSec';
import DateAndTime from '../_components/BookingSteps/DateAndTime';
import DateAndTimePage from '../date-and-time/page';






export default function ArtistPortfolio() {

    const router = useRouter()

    const handlePayment = () =>{
        router.push("/date-and-time")
    }




  return (
    <>
    <div className="container w-[90%] mx-auto py-7">

        <div className='bg-white p-4 rounded-md shadow-sm lg:w-xl mx-auto'>

        <div className='flex gap-2'>
            <div>
        <Image src={portfolio} width={100} height={100} alt='' className='rounded-full aspect-square object-cover' />
        </div>

        <div>
            <h2 className='font-semibold text-xl'>Lina Salem</h2>
            <p className='lg:w-md text-sm  text-gray-500'>Master Hair Stylist & Colorist with 10+ years experience. 
                Specializing in modern cuts, advanced color techniques, a
                nd bridal styling. Passionate about bringing your hair vision to 
                life while maintaining the health and integrity of your hair.</p>

                 <div className='flex gap-2 text-sm '>
                    <ul className='flex text-yellow-300'>
                        <li><i className="fa-solid fa-star text-yellow-400"></i></li>
                        <li><i className="fa-solid fa-star text-yellow-400"></i></li>
                        <li><i className="fa-solid fa-star text-yellow-400"></i></li>
                        <li><i className="fa-solid fa-star text-yellow-400"></i></li>
                        <li><i className="fa-solid fa-star text-yellow-400"></i></li>
                    </ul>
                    <p>4.9 (243 Reviews)</p>
                 </div>
        </div>

        </div>

         <div className='w-[80%] mx-auto mt-2 flex gap-3'>
            <Button className='bg-pink-500 text-black rounded-full'>+ Follow </Button>

            <Button className='bg-white text-black border border-gray-300 rounded-full'><LuMessageCircle/> Message </Button>

            <Button className='bg-white text-black border border-gray-300 rounded-full'><CiHeart/> Favorites </Button>
        </div>

        </div>

        <div className='mt-3 flex lg:flex-row flex-col gap-3'>

        <div className='lg:w-[60%] flex flex-col gap-2'>
           <div className='bg-white p-5 shadow-md rounded-sm'>

            <div className='flex items-center justify-between'>
                <h2 className='text-black font-semibold'>Portfolio</h2>
                <h3 className='text-gray-500 text-sm'>View All</h3>
            </div>

            <div className='flex flex-wrap gap-3 '>
                <Image src={portfollio1} alt='' width={150} height={150} className='rounded-md aspect-video object-cover w-[40%]'/>
                <Image src={portfollio2} alt='' width={150} height={150} className='rounded-md aspect-video object-cover w-[40%]'/>
                <Image src={portfollio3} alt='' width={150} height={150} className='rounded-md aspect-video object-cover w-[40%]'/>
                <Image src={portfollio4} alt='' width={150} height={150} className='rounded-md aspect-video object-cover w-[40%]'/>


            </div>

           </div>

           <div className='bg-white p-5 shadow-md rounded-sm'>
            <div>
                <h2 className='font-semibold text-black'>Reviews</h2>
            </div>

            <div className='flex flex-col gap-2'>

                <div className='flex gap-2'>

                <div className='bg-pink-300 w-fit px-3 py-1 h-fit rounded-full'>
                    <h3 className='text-pink-500 font-semibold'>J</h3>
                </div>

                <div>
                    <h1 className='font-semibold'>Jessica williams</h1>
                    <p className='text-gray-500 text-sm'>Best haircut I've ever had! She really understands what works for my hair type.</p>
                </div>

                </div>

                <div className='flex gap-2'>

                <div className='bg-pink-300 w-fit px-3 py-1 h-fit rounded-full'>
                    <h3 className='text-pink-500 font-semibold'>J</h3>
                </div>

                <div>
                    <h1 className='font-semibold'>Jessica williams</h1>
                    <p className='text-gray-500 text-sm'>Best haircut I've ever had! She really understands what works for my hair type.</p>
                </div>

                </div>

                <div className='flex gap-2'>

                <div className='bg-pink-300 w-fit px-3 py-1 h-fit rounded-full'>
                    <h3 className='text-pink-500 font-semibold'>J</h3>
                </div>

                <div>
                    <h1 className='font-semibold'>Jessica williams</h1>
                    <p className='text-gray-500 text-sm'>Best haircut I've ever had! She really understands what works for my hair type.</p>
                </div>

                </div>

            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-gray-600 text-sm bg-pink-500 p-2 rounded-md mt-2'>Add Yours</p>
                <Input type='text' placeholder='left your feed back here.....'/>
            </div>

           </div>
        </div>

        <div className='lg:w-[40%] flex flex-col gap-2'>
            <div className='bg-white p-5 shadow-md rounded-sm'>
                <div>
                    <h2 className='font-semibold'>Select service</h2>
                </div>

                <div>
                <FieldGroup className='gap-1'>

                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          
        />
        <FieldContent className='gap-0'>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Women's Haircut
          </FieldLabel>
          <FieldDescription>
            60 mins Professional cut with styling
          </FieldDescription>
        </FieldContent>
                    </Field>

                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          
        />
        <FieldContent className='gap-0'>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Hair Color Full
          </FieldLabel>
          <FieldDescription>
            120 mins Complete color transformation
          </FieldDescription>
        </FieldContent>
                    </Field>

                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          
        />
        <FieldContent className='gap-0'>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Balayage/Highlights
          </FieldLabel>
          <FieldDescription>
            150 mins Hand-painted highlights
          </FieldDescription>
        </FieldContent>
                    </Field>

                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          
        />
        <FieldContent className='gap-0'>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Blow Dry & Style
          </FieldLabel>
          <FieldDescription>
            45 mins Professional blow out styling
          </FieldDescription>
        </FieldContent>
                    </Field>

                    <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          
        />
        <FieldContent className='gap-0'>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Updo/Special Event
          </FieldLabel>
          <FieldDescription>
            90 mins Formal hairstyle for events
          </FieldDescription>
        </FieldContent>
                    </Field>

                </FieldGroup>

                </div>


            </div>

            <div className='bg-white p-5 shadow-md rounded-sm'>
                <div>
                    <h2 className='font-semibold mb-2'>Availability</h2>
                </div>

                <div>
                    <Calendar mode="single" className="rounded-lg border w-sm" />
                </div>

            </div>

                <Button onClick={handlePayment} className='cursor-pointer'>Book Appointment</Button>
            

        </div>


        </div>
        

    </div>
    </>
  )
}
