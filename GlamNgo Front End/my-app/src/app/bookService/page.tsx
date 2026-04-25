'use client'
import { Button } from "@/components/ui/button";
import HomeFooter from "../_components/HomeFooter/homeFooter";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { CiCalendar } from "react-icons/ci";
import {SearchIcon} from "lucide-react"
import { SlLocationPin } from "react-icons/sl";
import Artists from "../artists/page";









export default function BookService() {
  return (
    <>
    

      <div className="py-15 bg-linear-to-b from-pink-50 to-purple-50">

        <div className="text-center">
        <h1 className="font-bold text-5xl mb-3">Book a Service</h1>
        <p className="text-gray-500">Find and book the perfect makeup and hair artist for your special occasion</p>    
        </div>    

        <div className="lg:w-[60%] bg-white p-9 mx-auto mt-4 shadow rounded-xl">

        <div className="flex gap-2">
             <Field className="w-xs gap-1">
      <FieldLabel htmlFor="inline-start-input">Service Type</FieldLabel>
      <InputGroup className="shadow-none rounded-full">
        <InputGroupInput id="inline-start-input" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>

    <Field className="w-xs gap-1">
        <FieldLabel htmlFor="inline-start-input">Location</FieldLabel>
        <InputGroup className="shadow-none rounded-full">
        <InputGroupAddon>
          <InputGroupText>
          <SlLocationPin />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Enter your location" />
      </InputGroup>

    </Field>

    <Field className="w-xs gap-1">
        <FieldLabel htmlFor="inline-start-input">Date</FieldLabel>
        <InputGroup className="shadow-none rounded-full">
        <InputGroupAddon>
          <InputGroupText>
          <CiCalendar />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

    </Field>

        <Field className="w-xs gap-1">
      <FieldLabel htmlFor="inline-start-input">Service Type</FieldLabel>
      <InputGroup className="shadow-none rounded-full">
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
        </InputGroupAddon>
      </InputGroup>
    </Field>
        </div>

        <div className="mt-5">
            <Button className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full w-full">Search Artist</Button>
        </div>


        </div>


       </div>
       
       <div className="bg-white">
        <Artists/>
       </div>

       <HomeFooter/>


    
    </>
  )
}
