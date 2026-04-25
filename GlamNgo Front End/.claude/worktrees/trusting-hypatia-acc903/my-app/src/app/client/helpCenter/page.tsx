'use client'
import { IoCallOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function helpCenter() {
  return (
    <>

     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

      <div>
        <h1 className='font-bold text-3xl'>Help Center</h1>
        <p className="text-gray-500">Find answers to common questions and get support</p>
      </div>

      <div className="flex justify-between gap-2 lg:w-[80%]">

        <div className='shadow-md rounded-lg p-4 lg:w-xs flex flex-col items-center gap-1 '>

          <div className="bg-pink-200 w-fit p-4 rounded-full text-pink-500">
            <FaRegEnvelope className="text-lg"/>
          </div>
          <h1 className="font-bold text-xl">Email Support</h1>
          <p className="text-gray-500 text-sm">Get help via email</p>
          <Button className="bg-pink-500 text-white font-semibold">Send email</Button>

        </div>

        <div className='shadow-md rounded-lg p-4 lg:w-xs flex flex-col items-center gap-1 '>

          <div className="bg-pink-200 w-fit p-4 rounded-full text-pink-500">
            <IoCallOutline className="text-lg"/>
          </div>
          <h1 className="font-bold text-xl">Phone Support</h1>
          <p className="text-gray-500 text-sm">Call us for assistance</p>
          <p className="font-semibold text-pink-500 ">1-800-GLAM-NOW</p>

        </div>

      </div>

      <div className="shadow-md rounded-md p-3 flex flex-col gap-2">
        <h1 className="font-bold text-lg">Frequently Asked Questions</h1>

        <div>
    <Accordion type="single" collapsible className="lg:w-full flex flex-col gap-2">

      <h2 className="font-bold text-pink-500">Booking</h2>

      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">How do I book an appointment?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
          You can book an appointment by browsing our artists, selecting a service, and choosing an available time slot.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">Can I reschedule my booking?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
          Yes, you can reschedule up to 24 hours before your appointment through the 'My Bookings' page.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">What is the cancellation policy?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
          Free cancellation up to 24 hours before the appointment. Late cancellations may incur a fee.
        </AccordionContent>
      </AccordionItem>

      <h2 className="font-bold text-pink-500">Payments</h2>

      <AccordionItem value="item-4">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">What payment methods do you accept?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
          We accept all major credit cards, debit cards, and digital wallets.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">When will I be charged?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
        You'll be charged after your appointment is completed.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">Can i get a refund?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
        Refunds are available for cancellations made 24 hours before the appointment.
        </AccordionContent>
      </AccordionItem>

      <h2 className="font-bold text-pink-500">Loyalty Program</h2>

      <AccordionItem value="item-7">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">How do I earn loyalty points?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
        You earn 10 points for every dollar spent on services.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">How do I redeem my points?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
        Points can be redeemed for discounts on future bookings. 100 points = $10 credit.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-9">
        <AccordionTrigger className="bg-gray-200 p-2 hover:no-underline hover:bg-gray-300">Do points expire?</AccordionTrigger>
        <AccordionContent className="text-gray-500">
        Points expire after 12 months of inactivity.
        </AccordionContent>
      </AccordionItem>
     
    </Accordion>


          

        </div>


      </div>

      <div className="bg-pink-200 p-4 rounded-md text-center">
        <h1 className="font-bold text-xl">Still need help?</h1>
        <p className="text-gray-500">Our support team is available 24/7 to assit you</p>
        <Button className="w-fit">Contact Support</Button>

      </div>

     </div>

    </>
  )
}
