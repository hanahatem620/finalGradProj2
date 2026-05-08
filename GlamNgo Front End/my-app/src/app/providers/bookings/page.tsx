'use client'
import { ProviderBook } from "@/types/providerBooking.type";
import { Table} from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'
import { Booking } from "@/types/adminBookingReceipt.type";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LuMessageCircleMore } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";




export default function ProviderBookings() {

const [book, setBook] = useState<ProviderBook | null>(null)
  const [b, setB] = useState<Booking | null>(null)
  const [saving, setSaving] =useState(false)


 const bookings = book?.bookings ??  []

const pending = bookings.filter(
  b => b.status === 'PENDING')

const accepted = bookings.filter(
  b => b.status === 'CONFIRMED')

const completed = bookings.filter(
  b => b.status === 'COMPLETED')

const cancelled = bookings.filter(
  b => b.status === 'CANCELLED')

  const processed = [...completed, ...cancelled]

  const getInitials = (name: string) =>
  name
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
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-4'>
        <div>
            <h2 className='font-bold text-3xl'>Manage Bookings</h2>
            <p className='text-gray-500'>Review and respond to booking request from clients</p>
        </div>

         <div className="flex flex-col gap-5">
          <motion.div className="pending-booking"
          initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
          >
        <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xl">Pending Bookings</h2>
            <p className="text-pink-500 text-sm font-semibold">{pending.length} pending</p>
        </div>

                    <Table className="bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="pending" className="min-w-150">

                  <Table.Header className={'bg-pink-500'}>
                    <Table.Column isRowHeader>CLIENT</Table.Column>
                    <Table.Column>SERVICES</Table.Column>
                    <Table.Column>DATE & TIME</Table.Column>
                    <Table.Column>ACTION</Table.Column>
                  </Table.Header>

                  <Table.Body >
                    {pending.length == 0 ? (
                      <Table.Row>
      <Table.Cell colSpan={4}>
        <div className="p-5 border border-dashed border-gray-300 text-center text-gray-500">
          No pending bookings...
        </div>
      </Table.Cell>
    </Table.Row>
                    ) : (
                      pending.map((b) => (
                   <Table.Row key={b.id} >
      <Table.Cell className={'flex items-center gap-2'}>
        <div>
          <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">
            {getInitials(b.client.name)}
          </p>
        </div>

        <div>
          <h2 className="font-bold">{b.client.name}</h2>
          <p className="text-gray-500 text-xs">
             {b.client.email}
          </p>
        </div>
      </Table.Cell>

      <Table.Cell>
        {b.services.map(s => s.name).join(', ')}
      </Table.Cell>

      <Table.Cell className={'text-sm'}>
  <div className="flex flex-col leading-tight">
    <span>{b.date}</span>
    <span className="text-gray-500">{b.time.start}</span>
  </div>
</Table.Cell>

      <Table.Cell className={"flex gap-2"}>
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
        </motion.div>

         <motion.div className="accepted-booking"
         initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
         >
        <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xl">Accepted Bookings</h2>
            <p className="text-pink-500 text-sm font-semibold">Accepted Bookings</p>
        </div>

                    <Table className="bg-white">
              <Table.ScrollContainer>
                <Table.Content aria-label="accepted" className="min-w-150">
                  <Table.Header className={'bg-pink-500'}>
                    <Table.Column isRowHeader>CLIENT</Table.Column>
                    <Table.Column>SERVICES</Table.Column>
                    <Table.Column>DATE & TIME</Table.Column>
                    <Table.Column>ACTION</Table.Column>
                  </Table.Header>

                  <Table.Body>
                      {accepted.length === 0 ?(
                        <Table.Row>
      <Table.Cell colSpan={4}>
        <div className="p-5 border border-dashed border-gray-300 text-center text-gray-500">
          No accepted bookings...
        </div>
      </Table.Cell>
    </Table.Row>
                      ) :(

                         accepted.map((b) => (
    <Table.Row key={b.id}>
      <Table.Cell className={'flex items-center gap-2'}>
        <div>
          <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">
            {getInitials(b.client.name)}
          </p>
        </div>

        <div>
          <h2 className="font-bold">{b.client.name}</h2>
          <p className="text-gray-500 text-xs">{b.client.email}</p>
        </div>
      </Table.Cell>

      <Table.Cell>
        {b.services.map(s => s.name).join(', ')}
      </Table.Cell>

      <Table.Cell className={'text-sm'}>
  <div className="flex flex-col leading-tight">
    <span>{b.date}</span>
    <span className="text-gray-500">{b.time.start}</span>
  </div>
</Table.Cell>

      <Table.Cell>

    <div className="flex gap-2">
          <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-pink-100 text-pink-500 hover:bg-pink-50">
          <LuMessageCircleMore/>
          Contact Client</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col gap-3">
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              <div>
                <p className="bg-pink-50 text-pink-500 p-2 rounded-full w-fit">{getInitials(b?.client?.name)}</p>
              </div>

              <div>
                <h2 className="font-bold">{b?.client?.name}</h2>
                <h3 className="text-gray-500 text-xs">{b.client.email}</h3>
              </div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full mt-3" asChild>
            <div className="text-center flex flex-col items-center gap-2">
              <p className="font-bold text-black text-2xl"> Contact <span>{b?.client?.name}</span></p>
           {b?.client?.phone ? (
  <>
    <h3 className="bg-gray-100 text-black p-3 rounded-md">
      {b.client.phone}
    </h3>

    <a
      href={`tel:${b.client.phone}`}
      className="bg-pink-500 p-3 rounded-md text-white"
    >
      Call Now
    </a>
  </>
) : (
  <>
    <h3 className="bg-gray-100 text-black p-3 rounded-md">
      {b?.client?.email}
    </h3>

    <a
      href={`mailto:${b.client.email}`}
      className="bg-pink-500 p-3 rounded-md text-white"
    >
      Contact via Email
    </a>
  </>
)}
<Separator className="mt-4 mb-4"/>
<p className="bg-gray-100 text-gray-500 p-3 rounded-md">You can reach {b?.client?.name} directly for booking inquiries and updates</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

        <Button className="bg-white text-black border border-gray-200"
        onClick={() => applyStatus(b.id, 'COMPLETED')}>Complete
        </Button>
    </div>

      </Table.Cell>
    </Table.Row>
  ))
                      )}
              </Table.Body>

                </Table.Content>
              </Table.ScrollContainer>
            </Table>
        </motion.div>

        <motion.div className="processed-bokking"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        >
            <div>
                <h2 className="font-bold text-xl">Processed Bookings</h2>
            </div>

            <div className="flex flex-col gap-2">
        {completed.length == 0 ?(
        <div className="p-5 border border-dashed border-gray-300 text-center text-gray-500">
          No completed bookings...
        </div>
        ) :(
           processed.map((b) => (
    <div
      key={b.id}
      className="bg-gray-50 p-2 rounded-md flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <p className="text-pink-500 bg-pink-100 p-2 w-fit rounded-full font-semibold">
          {getInitials(b.client.name)}
        </p>
        <h3 className="font-semibold">{b.client.name}</h3>
      </div>

      <p>{b.services.map(s => s.name).join(', ')}</p>

      <p>{b.date}</p>

      <p
  className={`p-2 w-fit rounded-md ${
    b.status === 'COMPLETED'
      ? 'text-green-500 bg-green-100'
      : 'text-red-500 bg-red-100'
  }`}
>
  {b.status}
</p>
    </div>
          ))
        )}
          </div>

        </motion.div>

         </div>

    </div>
    </>
  )
}
