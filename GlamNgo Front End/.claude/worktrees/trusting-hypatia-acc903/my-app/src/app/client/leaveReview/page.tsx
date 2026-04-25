'use client'
import Image from 'next/image'
import React from 'react'
import img from '../../../../public/images/artist.jpg'
import { Separator } from '@/components/ui/separator'
import { CiStar } from "react-icons/ci";
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { HiOutlinePhoto } from "react-icons/hi2";
import { Button } from '@/components/ui/button'
import { FaStar } from "react-icons/fa6";




export default function LeaveReview() {
  return (
   <>
   <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>
    
 <div>
    <h1 className='font-bold text-3xl'>Leave a Review</h1>
    <p className='text-gray-500 text-sm'>Share your experience to help others find the perfect artist</p>
 </div>

 <div className='flex flex-col lg:flex-row gap-3 mt-3'>

    <div className='lg:w-[50%]'>

        <div className='bg-white shadow-md rounded-xl p-5 flex flex-col gap-5 '>

            <div className='flex items-center gap-3'>
                <div>
                    <Image src={img} width={50} height={50} alt='' className='rounded-full '/>
                </div>

                <div>
                    <h2 className='font-bold text-xl'>Gel Manicure</h2>
                    <p className='text-gray-500 text-sm'>with Lisa K. . Oct 10, 2024</p>
                </div>
            </div>

            <Separator/>

            <div>
                <h2 className='font-bold'>How would you rate your experience?</h2>
                <div className='flex gap-2'>
                    <CiStar className='text-3xl text-gray-300'/>
                    <CiStar className='text-3xl text-gray-300'/>
                    <CiStar className='text-3xl text-gray-300'/>
                    <CiStar className='text-3xl text-gray-300'/>
                    <CiStar className='text-3xl text-gray-300'/>
                </div>
                <div>
                    <h2 className='font-bold'>Tell us about your experience</h2>
                    <Textarea placeholder='Write your review here...' className='w-full border border-gray-300'/>
                </div>
            </div>

            <div>
                <h2 className='font-bold'>
                    What stood out? (optional)
                </h2>
                <div className='flex flex-wrap gap-2 w-sm  mt-2'>
                    <Badge variant="outline" >Professional</Badge>
                    <Badge variant="outline">On Time</Badge>
                    <Badge variant="outline">Great Results</Badge>
                    <Badge variant="outline">Friendly</Badge>
                    <Badge variant="outline">Clean Space</Badge>
                    <Badge variant="outline">Good Value</Badge>
                    <Badge variant="outline">Relaxing</Badge>
                    <Badge variant="outline">Skilled</Badge>
                </div>
            </div>

            <div>
                <h2 className='font-bold'>Add Photos (Optional)</h2>
                <div>
                     <label className="flex flex-col items-center justify-center w-full h-40 border border-gray-300 rounded-xl cursor-pointer">

        
            <HiOutlinePhoto className='text-4xl text-gray-400'/>
        
        <p className="text-md font-medium text-gray-500">
          Click to upload or drag and drop
        </p>

        
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG up to 10MB 
        </p>

        
        <input
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
        />

      </label>
                </div>
            </div>

            <div className='flex gap-2'>
                <Button className='bg-pink-500 text-white rounded-md flex-1'>Submit Review</Button>
                <Button variant="outline">Skip</Button>
            </div>

        </div>

    </div>

    <div className='lg:w-[50%]'>

    <div className='flex flex-col gap-5'>
        <div className='bg-pink-300 p-5 flex flex-col gap-3 rounded-md w-sm'>

        <h2 className='font-bold'>Earn Points!</h2>
        <p className='text-gray-600 max-w-55'>Leave a review and earn 10 bonus loyalty points</p>
        <div className='flex items-center gap-2'>
            <FaStar className='text-pink-500'/>

            <h2 className='font-bold'>+10 Points</h2>
        </div>

    </div>

    <div className='shadow-md rounded-md p-5 w-sm '>
        <h2 className='font-bold'>Review Tips</h2>
        <ul className='text-gray-600 mt-2'>
            <li>
                <i className="fa-solid fa-check text-pink-500 me-2"></i>
                Be honest and specific</li>
            <li>
                <i className="fa-solid fa-check text-pink-500 me-2"></i>
                Mention the artist's strengths</li>
            <li>
                <i className="fa-solid fa-check text-pink-500 me-2"></i>
                Include what could be improved</li>

                <li>
                <i className="fa-solid fa-check text-pink-500 me-2"></i>
                Add photos if possible</li>
        </ul>

    </div>
    </div>

    </div>




 </div>

   </div>
   
   </>
  )
}
