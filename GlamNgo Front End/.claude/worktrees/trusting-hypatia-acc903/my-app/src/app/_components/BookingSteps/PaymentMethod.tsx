import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Field, FieldGroup, FieldLabel,
  FieldContent,
  FieldDescription,
  FieldTitle, } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CiWallet } from "react-icons/ci";
import value from '../../../../public/images/valueIns.png'
import Image from "next/image";
import { LuCreditCard } from "react-icons/lu";


export default function PaymentMethod() {

    const router = useRouter()
    const [paymentMethod ,setPaymentMethod ] = useState("")
    
    const handlePayment =()=>{
        if(paymentMethod === "cash"){
     router.push('/payment-success')
    }
    else if(paymentMethod === "valU"){
     router.push("/paymentMethods/valU")
    }
    else if(paymentMethod === "card"){
     router.push("/paymentMethods/card")
    }
    }
  return (
    <>

      <div className="container w-[90%] mx-auto ">

       <div className="lg:w-[40%] mx-auto">
                  <div className="bg-white shadow-md rounded-md p-5 ">
        
                    <div>
                      <h2 className="font-bold text-sm">Select Payment Method</h2>
                    </div>
        
                    <div className='flex flex-col gap-2 mt-4'>
        
              <RadioGroup defaultValue="Cash" value={paymentMethod}
              onValueChange={setPaymentMethod}>
        
                <FieldLabel htmlFor="cash">
                  <Field orientation="horizontal" className="m-0 ">
                  <FieldContent className="flex flex-row items-center">
                   <div className="bg-gray-200 rounded-sm p-2">
                    <CiWallet className="text-xl text-gray-700"/>
                   </div>
                   <div>
                     <FieldTitle>Cash on Hand</FieldTitle>
                    <FieldDescription>
                      Pay when you arrive at the salon
                    </FieldDescription>
                   </div>
                  </FieldContent>
                  <RadioGroupItem value="cash" id="cash" />
                </Field>
                </FieldLabel>
        
                 <FieldLabel htmlFor="valU">
                <Field orientation="horizontal" className="m-0 ">
                  <FieldContent className="flex flex-row items-center">
                   <div>
                    <Image src={value} width={29} height={29} alt=""></Image>
                   </div>
                   <div>
                     <FieldTitle>valU Installments</FieldTitle>
                    <FieldDescription>
                      Pay in flexible monthly installments
                    </FieldDescription>
                   </div>
                  </FieldContent>
                  <RadioGroupItem value="valU" id="valU" />
                </Field>
              </FieldLabel>
        
                 <FieldLabel htmlFor="card">
                <Field orientation="horizontal" className="m-0 ">
                  <FieldContent className="flex flex-row items-center">
                   <div className="bg-linear-to-b from-blue-800 to-blue-900 rounded-sm p-2">
                    <LuCreditCard className="text-xl text-white"/>
                   </div>
                   <div>
                     <FieldTitle>Visa / MasterCard</FieldTitle>
                    <FieldDescription>
                      Pay securely with your credit card or debit card
                    </FieldDescription>
                   </div>
                  </FieldContent>
                  <RadioGroupItem value="card" id="card" />
                </Field>
              </FieldLabel>
        
              </RadioGroup>
              
        
                    </div>
        
                  </div>
                </div>
        
                <div className="lg:w-[50%] mx-auto mt-4">
                      <Button onClick={handlePayment} className="bg-pink-500 hover:bg-pink-500 text-white w-full cursor-pointer">Confirm Booking <i className="fa-solid fa-angle-right"></i> </Button>
        
                      <p className="text-sm text-center text-gray-500 mt-5">By continuing, you agree to our terms and conditions</p>
                </div>

        </div>
    </>
  )
}
