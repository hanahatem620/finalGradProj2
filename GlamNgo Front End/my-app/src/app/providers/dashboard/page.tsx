'use client'
import { BiDollar } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { CiCalendar } from "react-icons/ci";
import {Table} from "@heroui/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GetProvider } from "@/types/getProvider";
import { ProviderDash } from "@/types/providerDashboard.type";
import { ProviderBook } from "@/types/providerBooking.type";
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types/adminBookingReceipt.type";
import { toast } from "sonner";




export default function ProviderDashboard() {
    const [provider, setProvider] = useState<GetProvider | null>(null)
    const [dash, setDash] = useState<ProviderDash>()
    const [book, setBook] = useState<ProviderBook | null>(null)
    
    


       const getInitials = (name: string) => name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()


      useEffect(() => {
  const load = async () => {
    const res = await fetch('/api/artist/booking')
    if (!res.ok) return

    const data = await res.json()

    setBook(data)
    console.log(data)
  }

  load()
}, [])
  
useEffect(() => {
  const load = async () => {
    const res = await fetch('/api/me')
    if (!res.ok) return

    const data = await res.json()

    setProvider(data)
    console.log(data)
  }

  load()
}, [])

useEffect(() => {
  const load = async () => {
    const res = await fetch('/api/artist/dashboard')
    if (!res.ok) return

    const data = await res.json()

    setDash(data)
    console.log(data)
  }

  load()
}, [])


  const [b, setB] = useState<Booking | null>(null)
  const [saving, setSaving] = useState(false)


 const bookings = book?.bookings ??  []

const pending = bookings.filter(
  b => b.status === 'PENDING')


const cancelled = bookings.filter(
  b => b.status === 'CANCELLED')




async function applyStatus(id: number, status: string) {
  setSaving(true)
  try {
    const res = await fetch(`/api/artist/booking/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    console.log(data);
    

    if (!res.ok) {
      toast.error('Failed to update status', { position: 'top-center' })
      return
    }

    toast.success(`Status → ${status.toLowerCase()}`, { position: 'top-center' })

    // 👇 مهم عشان UI يتحدث
    window.location.reload()

  } finally {
    setSaving(false)
  }
}





  return (
   <>
    <div className="container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-7">

    <div>
        <h2 className='text-3xl'>Hello, <span className='font-bold text-pink-500'>{provider?.name}</span></h2>
        <p className='text-pink-500'>Here's what's happening today in your business</p>
    </div>

    <div className="flex gap-4">

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <CiCalendar className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Pending Bookings</p>
            <h2 className="font-bold">{dash?.bookings?.pending}</h2>
    </div>

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <RiGroupLine className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Accepted Bookings</p>
            <h2 className="font-bold">{dash?.bookings?.completed}</h2>
    </div>

    <div className='shadow-md rounded-md p-4 w-fit'>
            <div className="bg-pink-100 p-2 rounded-md w-fit">
                <BiDollar className="text-pink-500 text-2xl"/>
            </div>

            <p className="text-gray-500">Available Days</p>
            <h2 className="font-bold">{dash?.available_days}</h2>
    </div>


    </div>

    <div className="shadow-md rounded-md p-5">
        <h2 className="font-bold mb-3">Pending Artist Approvals</h2>

        <div>
    <Table className="bg-white">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-150">
          <Table.Header className={'bg-pink-500'}>
            <Table.Column isRowHeader>CLIENT</Table.Column>
            <Table.Column>SERVICES</Table.Column>
            <Table.Column>DATE</Table.Column>
            <Table.Column>STATUS</Table.Column>
            <Table.Column>ACTION</Table.Column>
          </Table.Header>

          <Table.Body>
            {pending.length == 0 ?(
              <Table.Row>
      <Table.Cell colSpan={5}>
        <div className="p-5 border border-dashed border-gray-300 text-center text-gray-500">
          No pending bookings...
        </div>
      </Table.Cell>
    </Table.Row>
            ):(
              pending.map((b) => (
                <Table.Row key={b.id}>
              <Table.Cell className={'flex items-center gap-2'}>
                <div>
                    <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">{getInitials(b.client.name)}</p>
                </div>
                <div>
                    <h2 className="font-bold">{b.client.name}</h2>
                    <p className="text-gray-500 text-xs">{b.client.email}</p>
                </div>
              </Table.Cell>

              <Table.Cell>  {b.services.map(s => s.name).join(', ')}</Table.Cell>
              <Table.Cell className={'text-sm'}>
                <div className="flex flex-col leading-tight">
                  <span>{b.date}</span>
                  <span className="text-gray-500">{b.time.start}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge className="bg-yellow-100 text-yellow-500">{b.status}</Badge>
              </Table.Cell>

             < Table.Cell className={"flex gap-2"}>
                      <Button className="bg-pink-500 text-white" 
                      onClick={() => applyStatus(b.id, 'CONFIRMED')}
                      >Approve</Button>
                      <Button className="bg-white text-black border border-gray-200"
                      onClick={() => applyStatus(b.id, 'CANCELLED')}
                      >Reject</Button>
                    </Table.Cell>
              
            </Table.Row>
              ))
            )}
            
          </Table.Body>

        </Table.Content>
      </Table.ScrollContainer>
    </Table>
        </div>

    </div>

    <div className="shadow-md rounded-md border border-gray-200 p-5">
        <div>
            <h2 className="font-bold mb-3">LATEST REVIEW ABOUT YOUR WORK</h2>
        </div>

        <div className="flex  items-center gap-2">
            <div>
                <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-bold">{getInitials(dash?.reviews?.items[0]?.client_name ?? '')}</p>
            </div>
            <div>
                <h2>{dash?.reviews?.items[0].client_name}</h2>
                <p className="font-semibold">{dash?.reviews.items[0].comment}</p>
            </div>
        </div>


    </div>


        </div>   
   </>
  )
}
