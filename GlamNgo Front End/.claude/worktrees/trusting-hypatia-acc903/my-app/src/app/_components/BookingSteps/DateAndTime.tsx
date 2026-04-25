'use client'
import Image from 'next/image'
import img from '../../../../public/images/portfolio1.jpg'
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input'
import PaymentOptionSec from './PaymentOptionSec'
import { useState } from 'react'
import PaymentMethod from './PaymentMethod'




export default function DateAndTime() {

const [step , setStep] = useState(1);


  return (
   <>
   <div className='container w-[90%] mx-auto py-7'>
    <div>
        <h1 className='font-bold text-xl'>Select Date and Time</h1>
    </div>

    <div className='bg-white rounded-md shadow-sm  p-5 mt-2'>

        <div className='flex items-center gap-2'>
            <div>
                <Image src={img} alt='' width={150} height={150} className='rounded-md aspect-video object-cover'/>
            </div>

            <div className='flex  justify-between items-center w-full'>
                <div>
                    <h1 className='font-bold'>Bridal look</h1>
                <p className='text-gray-500 text-sm'>Full face makeup & lashes</p>
                <p className='text-gray-500 text-sm'>60 minutes <span className='text-black font-bold'>. 6000 EGP</span></p>
                </div>

                <div>
                    <p className='text-pink-500 font-semibold'>Change</p>
                </div>
            </div>
        </div>

    </div>

    <div className='mt-3 flex flex-col lg:flex-row items-center gap-5 justify-center '>

    <div>
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-lg border w-xs"
    />
    </div>

    <div>
        <div className="p-5 bg-white lg:w-lg rounded-lg flex justify-center">
   <div inline-datepicker datepicker-buttons datepicker-autoselect-today></div>
   <div className="lg:w-lg">
      <h3 className="text-heading text-base font-medium mb-3 text-center">Wednesday 30 June 2024</h3>
      
      <label className="sr-only">
      Pick a time
      </label>
      <ul id="timetable" className="grid w-full grid-cols-2 gap-2 mt-5">
         <li>
            <Input type="radio" id="10-am" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="10-am" className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
               10:00 AM
            </label>
         </li>
         <li>
            <Input type="radio" id="10-30-am" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="10-30-am"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            10:30 AM
            </label>
         </li>
         <li>
            <Input type="radio" id="11-am" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="11-am"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            11:00 AM
            </label>
         </li>
         <li>
            <Input type="radio" id="11-30-am" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="11-30-am"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            11:30 AM
            </label>
         </li>
         <li>
            <Input type="radio" id="12-am" value="" className="hidden peer" name="timetable" checked/>
            <label htmlFor="12-am"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            12:00 AM
            </label>
         </li>
         <li>
            <Input type="radio" id="12-30-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="12-30-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            12:30 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="1-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="1-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            01:00 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="1-30-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="1-30-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            01:30 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="2-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="2-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            02:00 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="2-30-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="2-30-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            02:30 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="3-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="3-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            03:00 PM
            </label>
         </li>
         <li>
            <Input type="radio" id="3-30-pm" value="" className="hidden peer" name="timetable"/>
            <label htmlFor="3-30-pm"
               className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-neutral-primary border rounded-base cursor-pointer text-fg-brand border-brand peer-checked:border-brand peer-checked:bg-brand hover:text-white peer-checked:text-white hover:bg-brand-strong">
            03:30 PM
            </label>
         </li>
      </ul>
   </div>
    </div>
    </div>

        


    </div>

   <div className='mt-4 '>
      <PaymentMethod />
   </div>


   </div>
   
   </>
  )
}
