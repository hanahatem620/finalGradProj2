import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AppointBookingBtn() {

const router = useRouter()

const customerBooking = () =>{
    router.push('/appointBooking')
}


  return (
    <>
      <Button onClick={customerBooking} className="rounded-full w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer">
        Book Now
      </Button>
    </>
  )
}
