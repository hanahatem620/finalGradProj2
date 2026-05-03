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
import BookAppointFisrt from "../_components/BookingSteps/BookAppointFisrt";
import PaymentOptionSec from "../_components/BookingSteps/PaymentOptionSec";
import SuccessPaymentThird from "../_components/BookingSteps/SuccessPaymentThird";
import PaymentMethod from "../_components/BookingSteps/PaymentMethod";










export default function AppointBooking() {

    const [step , setStep] = useState(1);
  



  return (
    <>

      {step == 1 && <BookAppointFisrt setStep={setStep} />
        }

      {step == 2 && <>
      <PaymentOptionSec setStep={setStep}/> 
      <div className="bg-white">
        <PaymentMethod/>
      </div>
      
      </>
     }

     {step == 3 && <SuccessPaymentThird/>
      }



        
    
    
    
    </>
  )
}
