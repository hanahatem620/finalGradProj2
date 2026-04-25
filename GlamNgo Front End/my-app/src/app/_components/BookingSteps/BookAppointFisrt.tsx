'use client'
import { Field, FieldGroup, FieldLabel,
  FieldContent,
  FieldDescription,
  FieldTitle, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoPerson } from "react-icons/go";
import { LuPhone } from "react-icons/lu";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CiWallet } from "react-icons/ci";
import value from '../../../public/images/valueIns.png'
import Image from "next/image";
import { LuCreditCard } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function BookAppointFisrt({setStep} : Props) {


  return (
    <>
    <div className="container w-[90%] mx-auto py-10">

        <div className='lg:w-[60%] mx-auto bg-white shadow-xl rounded-md p-4'>
            
            <div className='flex flex-col gap-7'>

              <div>
                <h1 className='font-bold text-2xl bg-linear-to-r from-pink-500 via-purple-500 to-violet-600 bg-clip-text text-transparent '>
                Book Your Appointment
            </h1>

            <p className='text-gray-500 text-xs'>Fill in your details and we'll get back to you shortly</p>
              </div>

              <div className='bg-linear-to-r from-pink-500 via-purple-500 to-violet-600 p-5 rounded-md text-white font-bold'>
                <h2 className='text-2xl'>Event Ready Bundle</h2>
                <h3 className='text-xl'>850 EGP</h3>
              </div>

            </div>

            <div className="mt-5">
              <FieldGroup>
                <div className='flex gap-2'>

        <Field className="gap-1">
        <FieldLabel htmlFor="Full-name">
          <GoPerson />
          Full Name</FieldLabel>
        <Input id="Full-name" placeholder="Enter Your Full Name" className="bg-gray-100" type='text' />
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="Phone-Number">
          <LuPhone />
          Phone Number</FieldLabel>
        <Input id="Phone-Number" placeholder="Enter Your Phone Number" className="bg-gray-100" type='tel'/>
      </Field>
                </div>

        <Field className="gap-1">
        <FieldLabel htmlFor="Email">
          <HiOutlineEnvelope />
          Email Address</FieldLabel>
        <Input id="Email" placeholder="Enter Your Email address" className="bg-gray-100" type='email' />
      </Field>

      <div className='flex gap-2'>

        <Field className="gap-1">
        <FieldLabel htmlFor="Preferred-Date">
          <MdOutlineCalendarToday />
          Preferred Date</FieldLabel>
        <Input id="Preferred-Date" className="bg-gray-100" type='date' />
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="Preferred-Time">
          <FiClock />
          Preferred Time</FieldLabel>
        <Input id="Preferred-Time" className="bg-gray-100" type='time' />
      </Field>
                </div>
      
      <Field>
      <FieldLabel htmlFor="textarea-message">Additional Notes (Optional)</FieldLabel>
      <Textarea id="textarea-message" placeholder="Any special requests or details we should know..." />
    </Field>
      
    <div className="flex gap-2">
      <Button onClick={() => setStep((count : number) => count + 1)} className="bg-linear-to-r from-pink-500 to-purple-500 flex-4 cursor-pointer">Confirm Booking</Button>
      <Link href={'/offers'} className="bg-white text-black border border-gray-300 p-1 rounded-sm flex-1 flex justify-center font-semibold"> Cancel</Link>
    </div>

    </FieldGroup>
            </div>

        </div>

      </div>
    
    </>
  )
}
