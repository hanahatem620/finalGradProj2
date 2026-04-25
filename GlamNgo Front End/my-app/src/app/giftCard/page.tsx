'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { Separator } from "@/components/ui/separator"
import { HiLockClosed } from "react-icons/hi2";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { GoPerson } from "react-icons/go";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { Textarea } from "@/components/ui/textarea"
import { LuMessageSquare } from "react-icons/lu";
import { FiCreditCard } from "react-icons/fi";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import cele from '../../../public/images/confetti.png'
import Image from "next/image";
import { LuSparkles } from "react-icons/lu";
import { Badge } from "@/components/ui/badge"
import { FiDownload } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import { GoShareAndroid } from "react-icons/go";
import HomeFooter from "../_components/HomeFooter/homeFooter";









export default function GiftCard() {
  const [step , setStep] = useState(1);

    
  return (
    <>
    <div className="container w-[90%] mx-auto py-13">

  {step < 4 && <div>    <div className="flex flex-col items-center gap-3 text-center ">
                        <p className="bg-linear-to-b from-pink-400 to-pink-500 text-white font-semibold text-sm w-fit p-2 rounded-full flex items-center gap-2">
                        <AiOutlineGift />

                        PURCHASE GIFT CARD</p>
        
                        <h1 className="font-bold text-5xl">Give the Gift of Beauty</h1>
                        <p className="text-gray-500">
                          Complete your purchase in just a few simple steps</p>
      </div>

    <div>
  <div className="flex items-center justify-between w-[60%] mx-auto mt-10">
 {[1,2,3].map((s, i, arr) => (
  <div key={s} className="flex flex-col items-center flex-1 relative">
    
    <div className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold 
      ${step > s ? "bg-linear-to-b from-pink-400 to-pink-500 text-white" : step === s ? "bg-linear-to-b from-pink-400 to-pink-500 text-white" : "bg-gray-200 text-gray-600"}`}>
      {step > s ? <i className="fa-solid fa-check"></i> : s}
    </div>

    <p className={`mt-2 text-sm ${step >= s ? "text-pink-500 font-medium" : "text-gray-500"}`}>
      {["Amount","Details","Payment"][s-1]}
    </p>

    {i < arr.length - 1 && (
      <div className={`absolute top-5 lg:-right-37 lg:w-[63%] md:-right-16 md:w-[50%] -right-8.5 w-[40%] h-1 transform -translate-x-1/2
        ${step > s ? "bg-pink-500 rounded-md" : "bg-gray-600 rounded-md -z-10" }`} 
        ></div>
    )}
  </div>
))}

  </div>
    </div>
    </div>}


<div className="flex flex-col lg:flex-row gap-7 mt-8">
  <div className="lg:w-[70%]">
{step == 1 && <div >

  <div className="bg-white shadow shadow-gray-400 p-8 pb-27 rounded-lg ">
    
    <h2 className="font-bold text-xl">Select Gift Card Amount</h2>

  <div className="grid grid-cols-4 gap-4 mt-4">

  <div className="bg-white shadow  flex flex-col items-center border border-gray-300 rounded-lg p-4  ">
    <h1 className="font-bold text-2xl">500</h1>
    <p className="text-gray-500 font-semibold text-sm">EGP</p>
  </div>

   <div className="bg-gray-100 relative shadow  flex flex-col items-center border-2 border-pink-500 rounded-lg p-4  ">
    
    <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs absolute bottom-18 left-30">
      <p>Popular</p>
    </div>

    <h1 className="font-bold text-2xl">1000</h1>
    <p className="text-gray-500 font-semibold text-sm">EGP</p>
  </div>

  <div className="bg-white shadow  flex flex-col items-center border border-gray-300 rounded-lg p-4  ">
    <h1 className="font-bold text-2xl">1500</h1>
    <p className="text-gray-500 font-semibold text-sm">EGP</p>
  </div>

<div className="bg-white shadow  flex flex-col items-center border border-gray-300 rounded-lg p-4  ">
    <h1 className="font-bold text-2xl">2000</h1>
    <p className="text-gray-500 font-semibold text-sm">EGP</p>
  </div>


  </div>

<div className="mt-3">
  <label htmlFor="input-group-1" className="block mb-1 text-sm font-medium text-heading">Or Enter Custom Amount</label>
<div className="relative">
  <div className="absolute inset-y-0 inset-s-0  flex items-center ps-3 pointer-events-none">
      <p className="text-gray-600 font-semibold text-sm">EGP</p>
  </div>
  <Input type="text" id="input-group-1" className="block w-full ps-11 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base" placeholder="Enter amount"/>
</div>
<p className="text-gray-500 text-sm mt-1">Minimum amount: 100 EGP</p>
</div>

  <Button type="submit" onClick={() => setStep(count => count + 1)} className="w-full mt-5 rounded-full bg-linear-to-b from-pink-400 to-pink-500 text-white  cursor-pointer">
        Continue to Details
      </Button>
  </div>


</div>}


{step == 2 && <div > 

  <div className="bg-white shadow shadow-gray-400 p-8 rounded-lg ">
    
    <h1 className="font-bold text-2xl">Recipient Information</h1>

  <div>
    <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-3">
                  <GoPerson />
                  Recipient Name
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Enter recipient's full name"
                  type="text"
                  required
                />
    </Field>

    <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-4">
                  <HiOutlineEnvelope />
                  Recipient Email
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="recipient@example.com"
                  type="email"
                  required
                />

                <p className="text-sm text-gray-500">
                  Gift card will be sent to this email address
                </p>
    </Field>

  <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-3">
                  <GoPerson />
                  Your Name (Sender)
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="your full name"
                  type="text"
                  required
                />
    </Field>

     <Field className="gap-1">
      <FieldLabel htmlFor="textarea-message" className="mt-3">
        <LuMessageSquare />
        Personal Message (Optional)</FieldLabel>
      <Textarea id="textarea-message" placeholder="Add a personal message to make it special..." />
      <FieldDescription>Maximum 250 characters</FieldDescription>
    </Field>

  </div>

<div className="mt-5">
  <p className="font-semibold text-sm mb-1">Delivery Date</p>
  <Button className="bg-gray-50 px-7 text-pink-500 border border-pink-500 hover:bg-gray-50">Send Immediately</Button>
</div>

<div className="flex justify-between gap-1">

<Button type="submit" onClick={() => setStep(count => count - 1)} className="mt-5 flex-1 rounded-full bg-gray-300 hover:bg-gray-300 text-black cursor-pointer">
        back
      </Button>

  <Button type="submit" onClick={() => setStep(count => count + 1)} className="mt-5 flex-1 rounded-full bg-linear-to-b from-pink-400 to-pink-500 text-white cursor-pointer">
        Continue to Details
      </Button>
</div>

  
  </div>

  </div>}

{step == 3 && <div > 
  
    <div className="bg-white shadow shadow-gray-400 p-8 rounded-lg ">
    
    <h1 className="font-bold text-2xl">Payment Information</h1>

  <div>
    <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-3">
                  <FiCreditCard />
                  Card Number
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="1234 5678 9012 3456"
                  type="number"
                  required
                />
    </Field>

    <div className="flex gap-1 items-center">
          <Field className="gap-2">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-4">
                  Expiry Date
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  type="date"
                  required
                />

    </Field>

  <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-4">
                  CVV
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="123"
                  type="number"
                  required
                />
    </Field>
    </div>

  <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-3">
                  Cardholder Name
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Name on card"
                  type="text"
                  required
                />
    </Field>

    <Field className="gap-1">
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className="mt-3">
                  Billing Email
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Billing email"
                  type="email"
                  required
                />
    </Field>


  </div>

<div className="mt-5">
  <Alert className="bg-linear-to-tl from-purple-50 to-pink-50 border-0 p-8 w-full mt-3">
        <AlertDescription className="text-gray-800">
          <h3 className="font-semibold">I agree to the terms and conditions</h3>
          <p>By completing this purchase, you agree to our gift card terms and privacy policy.</p>
        </AlertDescription>
      </Alert>
</div>

<div className="flex justify-between gap-1">

<Button type="submit" onClick={() => setStep(count => count - 1)} className="mt-5 flex-1 rounded-full bg-gray-300 hover:bg-gray-300 text-black  cursor-pointer">
        back
      </Button>

  <Button type="submit" onClick={() => setStep(count => count + 1)} className="mt-5 flex-1 rounded-full bg-linear-to-b from-pink-400 to-pink-500 text-white  cursor-pointer">
        Complete Purchase
      </Button>
</div>

  
  </div>


  
  </div>}

</div>


{step < 4 && <div className="bg-white shadow shadow-gray-400 lg:w-[30%] p-8 rounded-lg">
      
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl ">Order Summary</h1>

      <div className="flex justify-between">
        <h3 className="text-gray-500">Gift Card Value</h3>
        <p className="font-bold">1000 EGP</p>
      </div>

        <div className="flex justify-between">
        <h3 className="text-gray-500">Processing Fee</h3>
        <p className="font-bold">Free</p>
      </div>

      <Separator className='bg-gray-300' />

      <div className="flex justify-between">
        <h3 className="font-bold">Total</h3>
        <p className="font-bold text-pink-500 text-xl">1000 EGP</p>
      </div>

      <div className="bg-linear-to-tl from-purple-50 to-pink-50 p-4 rounded-2xl">

        <h1 className="flex items-center font-bold gap-2 mb-2">
          <AiOutlineGift className="text-pink-500"/>
          What's Included
        </h1>

        <ul>
          <li>
            <ul className="flex flex-col gap-2 text-sm">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Digital gift card delivered via email</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Personalized message included</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Valid for all services</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Never expires</span>
        </li>

          </ul>
          </li>
        </ul>

      </div>

    <div className="flex flex-col items-center text-gray-500 text-sm">
      <h3 className="flex items-center gap-1">
        <HiLockClosed className="text-amber-700"/>
        Secure payment processing
      </h3>

      <p>Questions? Contact our support team</p>
    </div>

      </div>


  </div>}
</div>
  
  {step == 4 && <div>

      <div className="flex flex-col items-center gap-2 text-center">
      <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit rounded-full p-3">
        <i className="fa-solid fa-check text-white"></i>
      </div>
       <h1 className="flex items-center gap-1 font-bold text-3xl">Purchase Complete! 

        <Image src={cele} alt="confetti" width={40} height={40} className="object-contain" />
       </h1>

       <p className="text-gray-500 text-sm">Your gift card has been successfully created and sent</p>


      </div>

    <div className="bg-white pb-15 pt-5 p-5 mt-5 lg:w-[60%] mx-auto rounded-xl shadow-xl">

      <div className="flex flex-col gap-5 pt-5 p-5 bg-linear-to-br from-pink-500 via-pink-400 to-purple-500 rounded-lg text-white">

          <h3 className="flex items-center gap-1 font-semibold"><LuSparkles />
            BEAUTY SERVICES
          </h3>

      <div>
          <p className="text-sm">Gift Card Value</p>
          <h1 className="font-bold text-3xl">1000 EGP</h1>
      </div>

    <div className="bg-white/20  rounded-lg p-5">

      <p>Gift Card Code</p>
      <h1 className="text-2xl font-red-500">BEAUTY-X93QS2HBYMK</h1>

    </div>
    <p className="text-sm">Valid for all services • Never expires</p>


      </div>

      <div className="mt-5 flex flex-col gap-2">

        <div className="flex justify-between">
          <p className="text-gray-600">Order Number</p>
          <h2 className="font-bold">GC-E99UIMTVO</h2>
        </div>

<Separator className='bg-gray-200' />

      <div className="flex justify-between">
          <p className="text-gray-600">Gift Card Value</p>
          <h2 className="font-bold">1000 EGP</h2>
        </div>

        <Separator className='bg-gray-200' />

        <div className="flex justify-between">
          <p className="text-gray-600">Purchase Date</p>
          <h2 className="font-bold">March 16, 2026</h2>
        </div>

        <Separator className='bg-gray-200' />

        <div className="flex justify-between">
          <p className="text-gray-600">Status</p>
          <h2 className="font-bold">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <i className="fa-solid fa-check"></i>
        Delivered
      </Badge>
          </h2>
          </div>
        
        <Separator className='bg-gray-200' />

        <div className="flex gap-2">
          <Button className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full cursor-pointer flex-1">
            <FiDownload />
            Download Gift Card</Button>
          <Button className="bg-white border border-pink-500 text-pink-500 hover:bg-white rounded-full cursor-pointer flex-1">
            <HiOutlineEnvelope/>
            Email Gift Card</Button>
        </div>


      </div>

    </div>

    <div className="bg-white p-10 mt-3 rounded-xl lg:w-[60%] mx-auto shadow-xl">
    <h1 className="font-bold text-xl flex items-center gap-1 mb-4">
      <AiOutlineGift className="text-pink-500"/>
      What Happens Next?
    </h1>

    <div>
      <ul className="flex flex-col gap-4">

        <li className="flex">
          <div>
            <p className="text-white bg-linear-to-b from-pink-400 to-pink-500 w-fit rounded-full px-3 py-1 me-2">1</p>
          </div>
          
          <div>
            <h4 className="font-bold">Email confirmation sent</h4>
          <p className="text-sm text-gray-500">
            We've sent a confirmation email with the gift 
            card details to both you and the recipient.</p>
          </div>
        </li>

        <li className="flex">
          <div>
            <p className="text-white bg-linear-to-b from-pink-400 to-pink-500 w-fit rounded-full px-3 py-1 me-2">2</p>
          </div>
          
          <div>
            <h4 className="font-bold">Recipient Can Redeem</h4>
          <p className="text-sm text-gray-500">
           The recipient can use the gift card code during checkout for any of our services.</p>
          </div>
        </li>

        <li className="flex">
          <div>
            <p className="text-white bg-linear-to-b from-pink-400 to-pink-500 w-fit rounded-full px-3 py-1 me-2">3</p>
          </div>
          
          <div>
            <h4 className="font-bold">Track Balance</h4>
          <p className="text-sm text-gray-500">
            Check the remaining balance anytime by entering the gift card code on our website.</p>
          </div>
        </li>


      </ul>
    </div>


    </div>

    <div className="lg:w-[60%] mx-auto mt-5 grid grid-cols-2 lg:grid-cols-3 gap-2">

  <Link
    href="/"
    className="flex items-center justify-center gap-2 bg-linear-to-b from-pink-400 to-pink-500 text-white rounded-full px-4 py-2 font-semibold"
  >
    <AiOutlineHome />
    Back to Home
  </Link>

  <Link
    href="/giftCard"
    className="flex items-center justify-center gap-2 bg-white border border-pink-500 text-pink-500 rounded-full px-4 py-2 font-semibold"
  >
    <AiOutlineGift />
    Buy Another Card
  </Link>

  <Button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-600 rounded-full px-4 py-2 font-semibold col-span-2 lg:col-span-1">
    <GoShareAndroid />
    Share
  </Button>

</div>

    <div className="lg:w-[60%] mx-auto bg-pink-100 mt-5 rounded-sm py-4  text-center">
      <h3 className="font-bold">Need Help?</h3>
      <p className="text-gray-500 text-xs">If you have any questions about your gift card purchase, please contact our support team at 
        <span className="text-pink-500 font-semibold"> support@beautyservices.com</span></p>
    </div>



  </div>}


  </div>
    
    <HomeFooter/>
    
    
    </>
  )
}