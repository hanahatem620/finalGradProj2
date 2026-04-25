'use client'
import PaymentOptionSec from '@/app/_components/BookingSteps/PaymentOptionSec'
import { useState } from 'react';
import valueIns from '../../../../public/images/valueIns.png'
import Image from 'next/image';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from '@/components/ui/separator';
import SuccessPaymentThird from '@/app/_components/BookingSteps/SuccessPaymentThird';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ValU() {

    const [step , setStep] = useState(1);
    const router = useRouter()

    const valUPayment = ()=>{
    router.push('/payment-success')
    }

    
  return (
    <>
    
   {step == 1 &&  <PaymentOptionSec setStep={setStep}/>}
    
   <div className='bg-white min-h-screen'>
     <div className='container lg:w-[90%] mx-auto'>
        <div className=' shadow-md rounded-md p-5 lg:w-xl mx-auto'>

            <div className='flex gap-2'>
                <div>
                    <Image src={valueIns} width={50} height={50} alt=''/>
                </div>

                <div>
                    <h1 className='font-bold text-xl'>Choose Your Plan</h1>
                    <p className='text-gray-500 text-sm '>Select the number of months to pay</p>
                </div>
            </div>

            <div>
                <RadioGroup defaultValue="first" className="mt-3">
      <FieldLabel htmlFor="first">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className='text-xl font-bold'>2,100 EGP<span className='text-gray-500 text-sm font-normal'>/month</span></FieldTitle>
            <FieldDescription className='text-black font-bold'>3 Months plan</FieldDescription>
                <div>
                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Subtotal:</p>
                        <p>6,000 EGP</p>
                    </div>

                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Admin fees:</p>
                        <p>300 EGP</p>
                    </div>
                    <Separator className='bg-gray-200'/>
                    <div className='text-sm flex justify-between'>
                        <p>Total</p>
                        <p>6,300 EGP</p>
                    </div>
                </div>

          </FieldContent>
          <RadioGroupItem value="first" id="first" />
        </Field>
      </FieldLabel>

        <FieldLabel htmlFor="second">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className='text-xl font-bold'>2,100 EGP<span className='text-gray-500 text-sm font-normal'>/month</span></FieldTitle>
            <FieldDescription className='text-black font-bold'>3 Months plan</FieldDescription>
                <div>
                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Subtotal:</p>
                        <p>6,000 EGP</p>
                    </div>

                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Admin fees:</p>
                        <p>300 EGP</p>
                    </div>
                    <Separator className='bg-gray-200'/>
                    <div className='text-sm flex justify-between'>
                        <p>Total</p>
                        <p>6,300 EGP</p>
                    </div>
                </div>

          </FieldContent>
          <RadioGroupItem value="second" id="second" />
        </Field>
      </FieldLabel>

      <FieldLabel htmlFor="third">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className='text-xl font-bold'>2,100 EGP<span className='text-gray-500 text-sm font-normal'>/month</span></FieldTitle>
            <FieldDescription className='text-black font-bold'>3 Months plan</FieldDescription>
                <div>
                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Subtotal:</p>
                        <p>6,000 EGP</p>
                    </div>

                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Admin fees:</p>
                        <p>300 EGP</p>
                    </div>
                    <Separator className='bg-gray-200'/>
                    <div className='text-sm flex justify-between'>
                        <p>Total</p>
                        <p>6,300 EGP</p>
                    </div>
                </div>

          </FieldContent>
          <RadioGroupItem value="third" id="third" />
        </Field>
      </FieldLabel>

      <FieldLabel htmlFor="fourth">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className='text-xl font-bold'>2,100 EGP<span className='text-gray-500 text-sm font-normal'>/month</span></FieldTitle>
            <FieldDescription className='text-black font-bold'>3 Months plan</FieldDescription>
                <div>
                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Subtotal:</p>
                        <p>6,000 EGP</p>
                    </div>

                    <div className='text-gray-500 text-sm flex justify-between font-normal'>
                        <p>Admin fees:</p>
                        <p>300 EGP</p>
                    </div>
                    <Separator className='bg-gray-200'/>
                    <div className='text-sm flex justify-between'>
                        <p>Total</p>
                        <p>6,300 EGP</p>
                    </div>
                </div>

          </FieldContent>
          <RadioGroupItem value="fourth" id="fourth" />
        </Field>
      </FieldLabel>

    </RadioGroup>
            </div>

    <Button onClick={valUPayment}>Done</Button>


    </div>
    </div>
   </div>
   
   
   



    
    </>
  )
}
