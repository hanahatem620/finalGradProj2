'use client'
import { Field, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoPerson } from "react-icons/go";
import { LuPhone } from "react-icons/lu";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CiWallet } from "react-icons/ci";
import { LuCreditCard } from "react-icons/lu";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IoColorPaletteOutline } from "react-icons/io5";



export default function BackageBooking() {

 function formatDateYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${y}-${m}-${day}`
}
 
 // Format card number with spaces every 4 digits
 function formatCardNumber(value: string) {
   return value
     .replace(/\D/g, '')
     .slice(0, 16)
     .replace(/(.{4})/g, '$1 ')
     .trim()
 }
 
 // Format MM/YY
 function formatExpiry(value: string) {
   const digits = value.replace(/\D/g, '').slice(0, 4)
   if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
   return digits
 }
 
 // ══════════════════════════════════════════════════════════════════════════
 
   const router     = useRouter()
  const params = useParams();
const packageId = Number(params.id);
   const { data: session } = useSession()
 
  const [packageData, setPackageData] = useState<any>(null)
const [artists, setArtists] = useState<any[]>([])
const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

const [date, setDate] = useState<Date | undefined>()
const [time, setTime] = useState('10:00')

const [submitting, setSubmitting] = useState(false)

const [fullName, setFullName] = useState('')
const [phone, setPhone] = useState('')
const [email, setEmail] = useState('')
 
 
   // ── Payment ────────────────────────────────────────────────────────────
   const [paymentMethod, setPaymentMethod] = useState<'FAWRY' | 'CARD'>('FAWRY')
   const [cardOpen,      setCardOpen]      = useState(false)
   const [cardNumber,    setCardNumber]    = useState('')
   const [cardName,      setCardName]      = useState('')
   const [cardExpiry,    setCardExpiry]    = useState('')
   const [cardCvv,       setCardCvv]       = useState('')
 
 
   // FAWRY payment
   const [fawry, setFawry] = useState(false)
   const [fawryCode, setFawryCode] = useState("");
   
 
   // Card is valid when all fields are filled correctly
   const cardValid =
     cardNumber.replace(/\s/g, '').length === 16 &&
     cardName.trim().length > 0 &&
     cardExpiry.length === 5 &&
     cardCvv.length === 3
 


  useEffect(() => {
  async function loadPackage() {
    try {
      const res = await fetch(`/api/packages/${packageId}`)
      if (!res.ok) throw new Error()

      const data = await res.json()
      console.log("Package details:", data)

      setPackageData(data.package)
      setArtists(data.artists)
    } catch {
      toast.error("Failed to load package", {
        position: 'top-center',
        duration: 2000,
      })
    }
  }

  if (packageId) loadPackage()
}, [packageId])
 

   const [clientLocation, setClientLocation] = useState("")
 
   // ── Booking + payment submission ───────────────────────────────────────
  async function submitBooking(method: 'FAWRY' | 'CARD') {
  if (!packageData || !selectedArtistId || !date || !time) return

  setSubmitting(true)

  try {
    const bookingRes = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider_id: selectedArtistId,
        package_id: packageData.id,
        start_datetime: `${date.toISOString().split('T')[0]}T${time}`,
        end_datetime: `${date.toISOString().split('T')[0]}T${time}`,
        total_price: packageData.price,
        client_location: clientLocation,
      })
    })

    const bookingData = await bookingRes.json()
    if (!bookingRes.ok) {
      toast.error(bookingData.msg || 'Booking failed', {
        position: 'top-center',
        duration: 2000,
      })
      return
    }

    console.log({
  booking_id: bookingData.id,
  method,
  amount: packageData.price,
  status: 'COMPLETED',
})

    await fetch('/api/payments', {
      
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id: bookingData.id,
        method,
        amount: packageData.price,
        status: 'COMPLETED',
      })
    })

    toast.success('Booking confirmed!',{
      position: 'top-center',
      duration: 2000,
    })
    router.push('/client/booking')

  } finally {
    setSubmitting(false)
  }
}
 
   // ── Confirm button handler ─────────────────────────────────────────────
  async function confirm() {
  if (!session?.user) {
    toast.error('Please log in first',{
      position:'top-center',
      duration:2000
    })
    router.push('/LogIn')
    return
  }

  if (!selectedArtistId) {
    toast.error('Please select an artist', {
      position: 'top-center',
      duration: 2000,
    })
    return
  }

  if (paymentMethod === 'CARD') {
    setCardOpen(true)
    return
  }

  if (paymentMethod === 'FAWRY') {
    setFawry(true)
    return
  }
}
 
 useEffect(() => {
   if (fawry) {
     const code = Math.floor(100000000 + Math.random() * 900000000).toString()
     setFawryCode(code)
   }
 }, [fawry])
 
   // ── Card dialog pay handler ────────────────────────────────────────────
   async function handleCardPay() {
     if (!cardValid) return
     setCardOpen(false)
     // Clear card fields for security — we never store them
     setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv('')
     await submitBooking('CARD')
   }
 
   async function handleFawryPay(){
     setFawry(false)
     await submitBooking("FAWRY")
   }


  return (
    <>
    <div className="container w-[90%] mx-auto py-10">

        <div className='lg:w-[60%] mx-auto bg-white shadow-xl rounded-md p-4'>
            
            <div className='flex flex-col gap-7'>

              <div>
                <h1 className='font-bold text-2xl bg-linear-to-r from-pink-500 via-purple-500 to-violet-600 bg-clip-text text-transparent '>
                Book Your Appointment
            </h1>

            <p className='text-gray-500 text-xs'>Fill in your details and we'll get back to you shortly</p>
              </div>

              <div className='bg-linear-to-r from-pink-500 via-purple-500 to-violet-600 p-5 rounded-md text-white font-bold'>
                <h2 className='text-2xl'>{packageData?.name}</h2>
                <h3 className='text-xl'>{packageData?.price} EGP</h3>
              </div>

            </div>

            <div className="mt-5">
              <FieldGroup>
                <div className='flex gap-2'>

        <Field className="gap-1">
        <FieldLabel htmlFor="Full-name">
          <GoPerson />
          Full Name</FieldLabel>
        <Input id="Full-name" placeholder="Enter Your Full Name" className="bg-gray-100" type='text'
         value={fullName}
  onChange={(e) => setFullName(e.target.value)}
        />
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="Phone-Number">
          <LuPhone />
          Phone Number</FieldLabel>
          <Input
  id="Phone-Number"
  placeholder="Enter Your Phone Number"
  className="bg-gray-100"
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
      </Field>
                </div>

        <div className="flex items-center gap-2 justify-center">
        <Field className="gap-1">
        <FieldLabel htmlFor="Email">
          <HiOutlineEnvelope />
          Email Address</FieldLabel>
          <Input
  id="Email"
  placeholder="Enter Your Email address"
  className="bg-gray-100"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
      </Field>

      <div className="w-full">
      <FieldLabel className="mb-1">
  <IoColorPaletteOutline />
  Available Artists
</FieldLabel>

<Select
  value={selectedArtistId ? String(selectedArtistId) : ""}
  onValueChange={(v) => {
    setSelectedArtistId(Number(v))
  }}
>
  <SelectTrigger className="w-full bg-gray-100">
    <SelectValue placeholder="Select an artist" />
  </SelectTrigger>

  <SelectContent>
    {artists?.length ? (
      artists.map((a) => (
        <SelectItem key={a.id} value={String(a.id)}>
          {a.name} ({a.role})
        </SelectItem>
      ))
    ) : (
      <SelectItem value="none" disabled>
        No artists available
      </SelectItem>
    )}
  </SelectContent>
</Select>
      </div>


        </div>

      <div className='flex gap-2'>

        <Field className="gap-1">
        <FieldLabel htmlFor="Preferred-Date">
          <MdOutlineCalendarToday />
          Preferred Date</FieldLabel>
        <Input
  id="Preferred-Date"
  type="date"
  value={date ? formatDateYMD(date) : ''}
  onChange={(e) => setDate(new Date(e.target.value))}
/>
      </Field>

      <Field className="gap-1">
        <FieldLabel htmlFor="Preferred-Time">
          <FiClock />
          Preferred Time</FieldLabel>
        <Input id="Preferred-Time" 
        type="time"
  value={time}
  onChange={(e) => setTime(e.target.value)}
        className="bg-gray-100" />
      </Field>
                </div>
      
      <Field>
      <FieldLabel htmlFor="textarea-message">Your Location</FieldLabel>
      <Textarea
  value={clientLocation}
  onChange={(e) => setClientLocation(e.target.value)}
  placeholder="Enter your location"
/>
    </Field>
      
    <div className="flex gap-2">
      <Button onClick={confirm} disabled={submitting}  className="bg-linear-to-r from-pink-500 to-purple-500 flex-4 cursor-pointer">
       {submitting ? 'Booking...' : 'Confirm Booking'}</Button>
      <Link href={'/offers'} className="bg-white text-black border border-gray-300 p-1 rounded-sm flex-1 flex justify-center font-semibold"> Cancel</Link>
    </div>

    </FieldGroup>
            </div>

        </div>

         <div className='lg:w-[60%] mx-auto mt-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5'>
            <h2 className='font-bold text-xl mb-4'>Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={v => setPaymentMethod(v as 'FAWRY' | 'CARD')}
              className='space-y-3'
            >

              {/* FAWRY */}
              <label
                htmlFor='pay-fawry'
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition
                  ${paymentMethod === 'FAWRY'
                    ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                  }`}
              >
                <RadioGroupItem value='FAWRY' id='pay-fawry' />
                <div className='bg-gray-100 p-2 rounded-lg'>
                  <CiWallet className='text-2xl text-gray-600' />
                </div>
                <div>
                  <p className='font-semibold'>Fawry</p>
                  <p className='text-xs text-gray-500'>Pay easily using your Fawry code at any nearby outle</p>
                </div>
              </label>

              {/* Card */}
              <label
                htmlFor='pay-card'
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition
                  ${paymentMethod === 'CARD'
                    ? 'border-pink-400 bg-pink-50/40 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                  }`}
              >
                <RadioGroupItem value='CARD' id='pay-card' />
                <div className='bg-blue-600 p-2 rounded-lg'>
                  <LuCreditCard className='text-2xl text-white' />
                </div>
                <div>
                  <p className='font-semibold'>Visa / MasterCard</p>
                  <p className='text-xs text-gray-500'>Pay securely with your credit or debit card</p>
                </div>
              </label>

            </RadioGroup>
          </div>

      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <LuCreditCard className='text-pink-500' />
              Card Details
            </DialogTitle>
            <DialogDescription>
              Enter your card information to complete the booking.
              Your details are never stored.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 mt-2'>

            {/* Card Number */}
            <div className='space-y-1'>
              <Label htmlFor='card-number'>Card Number</Label>
              <Input
                id='card-number'
                placeholder='1234 5678 9012 3456'
                value={cardNumber}
                maxLength={19}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className='font-mono tracking-widest'
              />
            </div>

            {/* Cardholder Name */}
            <div className='space-y-1'>
              <Label htmlFor='card-name'>Name on Card</Label>
              <Input
                id='card-name'
                placeholder='John Doe'
                value={cardName}
                onChange={e => setCardName(e.target.value)}
              />
            </div>

            {/* Expiry + CVV */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label htmlFor='card-expiry'>Expiry Date</Label>
                <Input
                  id='card-expiry'
                  placeholder='MM/YY'
                  value={cardExpiry}
                  maxLength={5}
                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                  className='font-mono'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='card-cvv'>CVV</Label>
                <Input
                  id='card-cvv'
                  placeholder='123'
                  value={cardCvv}
                  maxLength={3}
                  type='password'
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className='font-mono'
                />
              </div>
            </div>

            {/* Order summary inside dialog */}
            <div className='bg-gray-50 rounded-lg p-3 text-sm space-y-1'>
              <div className='flex justify-between text-gray-500'>
                <span>Services</span>
              </div>
              <div className='flex justify-between font-bold text-base'>
                <span>Total</span>
                <span className='text-pink-500'>EGP {packageData?.price}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex gap-3 pt-1'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => {
                  setCardOpen(false)
                  setCardNumber(''); setCardName('')
                  setCardExpiry(''); setCardCvv('')
                }}
              >
                Cancel
              </Button>
              <Button
                className='flex-1 bg-pink-500 hover:bg-pink-600'
                disabled={!cardValid || submitting}
                onClick={handleCardPay}
              >
                {submitting ? 'Processing…' : `Pay EGP ${packageData?.price}`}
              </Button>
            </div>

            <p className='text-xs text-gray-400 text-center'>
              🔒 Secured — card details are never stored on our servers
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={fawry} onOpenChange={setFawry}>
  <DialogContent className='sm:max-w-md'>
    <DialogHeader>
      <DialogTitle>Fawry Code</DialogTitle>
      <DialogDescription>
        Use this code to pay at any Fawry outlet.
      </DialogDescription>
    </DialogHeader>

    <div className='space-y-4 mt-4'>

      <div className='bg-gray-100 p-4 rounded-md flex items-center justify-between'>
        <span className='font-mono text-lg'>{fawryCode}</span>

        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(fawryCode)
            toast.success("Code Copied!",{
              position:'top-center',
              duration:2000
            })
          }}
        >
          Copy
        </Button>
      </div>

      {/* Summary */}
      <div className='bg-gray-50 rounded-lg p-3 text-sm space-y-1'>
        <div className='flex justify-between text-gray-500'>
          <span>Services</span>
          {/* <span>{selectedServices.length} selected</span> */}
        </div>
        <div className='flex justify-between font-bold text-base'>
          <span>Total</span>
          <span className='text-pink-500'>
            EGP {packageData?.price}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex gap-3'>
        <Button
          variant='outline'
          className='flex-1'
          onClick={() => setFawry(false)}
        >
          Close
        </Button>

        <Button
          className='flex-1 bg-green-600 hover:bg-green-700'
          onClick={() => 
            handleFawryPay()}
        >
          Done
        </Button>
      </div>

    </div>
  </DialogContent>
      </Dialog>


      </div>
    
    </>
  )
 }
