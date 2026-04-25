'use client'

import { HiOutlineEnvelope } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { LuDownload } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";


export default function SuccessPaymentThird() {


  return (
    <>
     <div className="bg-white min-h-screen">

        <div className="container w-[90%] mx-auto py-10">
          
          <div className="text-center flex flex-col gap-2">
            
            <div className="bg-green-200 w-fit mx-auto p-3 rounded-full">
              <i className="fa-regular fa-circle-check text-green-500 text-xl"></i>
            </div>

            <h1 className="text-pink-400 text-2xl">Payment Successful!</h1>
            <p className="text-gray-500 max-w-90 mx-auto">Your payment has been processed successfully. 
              You will receive a confirmation email shortly.</p>

          </div>

          <div className="lg:w-[50%] mx-auto bg-gray-100 p-6 rounded-md mt-4">

       <div className="flex flex-col gap-2">

             <div className="flex justify-between">
              <h2 className="text-gray-500">Amount</h2>
              <p className="font-semibold">$149.99</p>
            </div>

                <Separator className='bg-gray-300' />

                <div className="flex justify-between">
              <h2 className="text-gray-500">Transaction ID</h2>
              <p className="border border-gray-300 rounded-md text-xs p-1 font-semibold">TXN-789123456</p>
                </div>

              <div className="flex justify-between">
              <h2 className="text-gray-500">Method</h2>
              <p className="font-semibold">**** 4242</p>
                </div>

                <div className="flex justify-between">
              <h2 className="text-gray-500">Date</h2>
              <p className="font-semibold">Dec 15, 2024</p>
                </div>

                <div className="flex justify-between">
              <h2 className="text-gray-500">Merchant</h2>
              <p className="font-semibold">TechStore Pro</p>
                </div>



       </div>

          </div>

          <div className="lg:w-[50%] mx-auto mt-4">
              <div className="bg-blue-50 p-5 rounded-md">
                <p className="flex items-center justify-center"> <HiOutlineEnvelope className="me-5"/>
              Receipt sent to   GlamNgo.com
              </p>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Button className="text-white bg-pink-500 w-full">
                  <LuDownload />
                  Download Receipt
                </Button>

                <Link href={'/'} className=" bg-white border border-gray-300 flex items-center justify-center p-1 rounded-md">
                  <MdOutlineArrowBack className="me-2"/>
                  Return to Store
                </Link>

                <p className="text-gray-500 text-center mt-4">Need help? Contact our support team at support@GlamNgo.com</p>
              </div>


          </div>
          
          </div>      
      
      </div>
    
    </>
  )
}
