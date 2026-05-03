'use client'
import { FaRegEnvelope } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import HomeFooter from "../_components/HomeFooter/homeFooter";





export default function ContactUs() {
  return (
    <>
   <div className='bg-white min-h-screen pb-10'>

     <div className='py-15 bg-linear-to-r from-purple-50 to-pink-50'>
      <div className='container mx-auto text-center'>
        <h1 className='text-4xl font-bold'>Contact Us</h1>
        <p className='text-gray-500 max-w-115 mx-auto mt-3'>Have questions? we'd love to hear from you. Send us a message and we'll respond as soon as possible</p>
      </div>
    </div>


      <div className='container w-[60%] mx-auto mt-5'>
        
       <div className="flex flex-col lg:flex-row justify-between gap-5">

         <div className='relative p-5 bg-pink-50 w-xs rounded-md '>
          <div className="absolute -top-4">
              <FaRegEnvelope className="text-pink-500 bg-white p-2 text-4xl rounded-full shadow-md"/>
          </div>

          <div>
            <h3 className="font-bold">Email</h3>
            <p className="text-gray-500">Support@glamNgo.com</p>
          </div>

        </div>

        <div className='relative p-5 bg-pink-50 w-xs rounded-md '>
          <div className="absolute -top-4">
              <LuPhone className="text-pink-500 bg-white p-2 text-4xl rounded-full shadow-md"/>
          </div>

          <div>
            <h3 className="font-bold">Phone</h3>
            <p className="text-gray-500">+1 (555) 123-456</p>
          </div>

        </div>
       </div>

      </div>

      <div className="container w-[90%] mx-auto mt-5">

       <form className="w-full max-w-lg mx-auto">
      <FieldGroup className="shadow-xl p-8 rounded-md">
        <FieldLabel className="text-center">
        Send us a Message  
        </FieldLabel>

        <Field className="gap-0">
          <FieldLabel htmlFor="form-name">Name</FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="Evil Rabbit"
            required
          />
        </Field>

        <div className="flex gap-2">
          <Field className="gap-0">
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input id="form-email" type="email" placeholder="john@example.com" />
        </Field>
        
          <Field className="gap-0">
            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
            <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
          </Field>
        </div>

        <Field className="gap-0">
          <FieldLabel htmlFor="form-address">Subject</FieldLabel>
          <Textarea placeholder="How can we help?"/>
        </Field>

        <Field className="gap-0">
          <FieldLabel htmlFor="form-address">Message</FieldLabel>
          <Textarea placeholder="Tell us more about your inquiry..."/>
        </Field>


        <Field orientation="horizontal">

          <Button type="submit" className="bg-linear-to-t from-pink-500 to-pink-400 w-full">Send Message</Button>
        </Field>
      </FieldGroup>
    </form>

      </div>

   </div>

    <HomeFooter/>

    </>
  )
}
