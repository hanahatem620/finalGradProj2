'use client'
import { Button } from "@/components/ui/button";
import { FaBell } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldContent,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator";
import { IoIosNotificationsOutline } from "react-icons/io";
import NotificationsList from "@/app/_components/NotificationList/NotificationList";



export default function Notification() {
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

        <NotificationsList />
    
    </div>
    </>
  )
}
