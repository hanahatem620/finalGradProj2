'use client'
import { LuCreditCard } from "react-icons/lu";
import { BsPaypal } from "react-icons/bs";
import { FaApplePay } from "react-icons/fa";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";


export default function Card({ onClose, bookingData }:any) {



  
  return (
    <>
    <div className='bg-white min-h-screen'>
        <div className='container w-[80%] mx-auto py-7'>

           <div className="lg:w-xl mx-auto">
             <div className='shadow-md rounded-md p-3'>
                <div>
                <h1 className='font-bold text-3xl mb-3'>Payment Method</h1>
            </div>

            <div className="flex gap-2">
            <div className='border border-gray-200 rounded-md p-4 w-[20%] flex flex-col items-center'>
                <LuCreditCard />
                <p className="text-gray-800">Card</p>
            </div>

            <div className='border border-gray-200 rounded-md p-4 w-[20%] flex flex-col items-center'>
                <BsPaypal />
                <p className="text-gray-800">PayPal</p>
            </div>

            <div className='border border-gray-200 rounded-md p-4 w-[20%] flex flex-col items-center'>
                <FaApplePay className="text-xl"/>
                <p className="text-gray-800">Apple Pay</p>
            </div>
            </div>

            <div className="mt-3 ">
      <form>
        <FieldGroup>
          <FieldSet>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Name on Card
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                  Card Number
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>
                  Enter your 16-digit card number
                </FieldDescription>
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="checkout-exp-month-ts6">
                    Month
                  </FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="checkout-exp-month-ts6">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                        <SelectItem value="04">04</SelectItem>
                        <SelectItem value="05">05</SelectItem>
                        <SelectItem value="06">06</SelectItem>
                        <SelectItem value="07">07</SelectItem>
                        <SelectItem value="08">08</SelectItem>
                        <SelectItem value="09">09</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                    Year
                  </FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="checkout-7j9-exp-year-f59">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                  <Input id="checkout-7j9-cvv" placeholder="123" required />
                </Field>

              </div>
            </FieldGroup>
          </FieldSet>         
          
        </FieldGroup>
      </form>
    </div>

            </div>

            <div className="shadow-md rounded-md p-3 mt-5">
                <div>
                    <h1 className="font-bold text-xl">Billing Address</h1>
                </div>

                <div>
                    <FieldSet>

                <FieldGroup>

                    <div className="flex gap-1 mt-3">
                        <Field className="gap-1">
                    <FieldLabel htmlFor="First-name">Fisrt Name</FieldLabel>
                    <Input id="firstName" type="text" placeholder="john" />
                    </Field>

                    <Field className="gap-1">
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input id="lastName" type="text" placeholder="Doe" />
                    </Field>
                    </div>

                    <Field className="gap-1">
                    <FieldLabel htmlFor="street">Street Name</FieldLabel>
                    <Input id="street" type="text" placeholder="123 Main St" />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                    <Field className="gap-1">
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input id="city" type="text" placeholder="New York" />
                    </Field>

                    <Field className="gap-1">
                        <FieldLabel htmlFor="state">State / Province</FieldLabel>
                        <Input id="state" type="text" />
                    </Field>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                    <Field className="gap-1">
                        <FieldLabel htmlFor="zip">Zip / Postal code</FieldLabel>
                        <Input id="zip" type="number" placeholder="10001" />
                    </Field>

                    <Field className="gap-1">
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                        <Input id="country" type="text" />
                    </Field>
                    </div>
                </FieldGroup>
                </FieldSet>
                </div>

            </div>

            <div className="shadow-md rounded-md p-3 mt-5">
                <div>
                    <h1 className="font-bold text-lg">Contact Information</h1>
                </div>

                <div>
                    <FieldGroup>
                         <Field className="gap-1">
                    <FieldLabel htmlFor="Email-Address">Email Address</FieldLabel>
                    <Input id="emailAddress" type="email" placeholder="john.doe@example.com" />
                    <p className="text-sm text-gray-500">Booking confirmation will be sent to this email</p>
                    </Field>

                     <Field className="gap-1">
                    <FieldLabel htmlFor="Phone-Number">Phone Number</FieldLabel>
                    <Input id="phoneNumber" type="tel" placeholder="+1 (555) 123-4567" />
                    </Field>

                    </FieldGroup>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <Link href={'/payment-success'} className="bg-pink-500 text-white p-2 rounded-md">Confirm</Link>
            </div>
           </div>

        </div>
    </div>
    
    </>
  )
}
