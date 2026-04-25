'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ServiceBookingBtn({ title } : {title :string}) {

const router = useRouter()

const serviceBooking = () =>{
    router.push('/bookService')
}

  return (
    <>
    
    <Button onClick={serviceBooking} className="rounded-full w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer">
        {title}
      </Button>

    </>
  )
}
