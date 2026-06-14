'use client'
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { GoDotFill } from "react-icons/go"
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LuClock4 } from "react-icons/lu"
import { IoPersonOutline } from "react-icons/io5"
import { Segment } from "@/app/_components/BookingTimeline/BookingTimeline"
import { useSession } from "next-auth/react"
import { ProviderBook } from "@/types/providerBooking.type"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FaCalendarTimes } from "react-icons/fa";
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"



// ================= TYPES =================

type SlotStatus =
  | "available"
  | "booked"
  | "unavailable"
  | "past"

type CalendarDayInfo = {
  status: SlotStatus
  bookings: number
}

// ================= HELPERS =================

function formatDateYMD(d: Date) {
  return d.toISOString().split("T")[0]
}

function getDayStatus(
  segments: Segment[]
): CalendarDayInfo {
  if (!segments?.length) {
    return {
      status: "available",
      bookings: 0,
    }
  }

  const bookedCount = segments.filter(
    s => s.status === "booked"
  ).length

 if (bookedCount > 0) {
    return {
      status: "booked",
      bookings: bookedCount,
    }
  }

  // 🔥 any time-off
  const hasTimeOff = segments.some(
    s =>
      s.status === "unavailable" &&
      s.reason === "time-off"
  )

  if (hasTimeOff) {
    return {
      status: "unavailable",
      bookings: 0,
    }
  }

  return {
    status: "available",
    bookings: 0,
  }

}

// ================= PAGE =================

export default function ProviderSchedule() {

  const { data: session } = useSession()

  const providerId = Number(session?.user?.id)

  const [date, setDate] = useState<Date>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d
  })
  

 const [open, setOpen] = useState(false)
  const [dates, setDates] = React.useState<Date | undefined>(undefined)

  const [availabilityMap, setAvailabilityMap] =
    useState<Record<string, CalendarDayInfo>>({})

    const [book, setBook] = useState<ProviderBook | null>(null)

    const [startTime, setStartTime] = useState("")
const [endTime, setEndTime] = useState("")
const [loading, setLoading] = useState(false)

function format(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const today = format(new Date())

const todayBookings =
  book?.bookings?.filter((b) => {
    const d = new Date(b.date) 
    return format(d) === today
  }) || []
    

  // ================= LOAD MONTH =================

  useEffect(() => {
    if (!providerId || isNaN(providerId)) return

    const year = date.getFullYear()
    const month = date.getMonth()

    const daysInMonth =
      new Date(year, month + 1, 0).getDate()

    async function loadMonth() {

      const result: Record<
        string,
        CalendarDayInfo
      > = {}

      for (let day = 1; day <= daysInMonth; day++) {

        const current = new Date(year, month, day)

        const key = formatDateYMD(current)

        try {

          const res = await fetch(
            `/api/provider/availability/${providerId}?date=${key}`
          )

          if (!res.ok) continue

          const data = await res.json()
          

          result[key] = getDayStatus(
            data.segments || []
          )

        } catch (err) {
          toast.error("Failed to load availability") 
        }
      }

      setAvailabilityMap(result)
    }

    loadMonth()

  }, [providerId, date])

  useEffect(() => {
    const load = async () => {
    const res = await fetch('/api/artist/booking')
    if (!res.ok) return

    const data = await res.json()


    setBook(data)
  }

  load()
}, [])


async function createTimeOff() {
  if (!dates || !startTime || !endTime) {
    toast.error("Please select date and time", {
      position: 'top-center',
      duration: 2000
    })
    return
  }

  try {
    setLoading(true)

    // combine date + time
    const formattedDate = format(dates)

    const start_datetime = new Date(
      `${formattedDate}T${startTime}`
    ).toISOString()

    const end_datetime = new Date(
      `${formattedDate}T${endTime}`
    ).toISOString()



    const res = await fetch("/api/artist/time-offs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_datetime,
        end_datetime,
        reason: "time-off",
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.msg || "Failed")
    }


    toast.success("Time off created successfully",{
      position: 'top-center',
      duration:2000
    })

    // reset
    setStartTime("")
    setEndTime("")

  } catch (error: any) {
    toast.error("Failed to create time off",{
      position: 'top-center',
      duration:2000
    })
  } finally {
    setLoading(false)
  }
}

  // ================= RENDER =================

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>

      {/* HEADER */}

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>
            Artist Schedule
          </h2>

          <p className='text-gray-500'>
            Manage your appointment and availability
          </p>
        </div>

        <div>
          <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-pink-500">
          <FaCalendarTimes/>
          set time-offs</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Time Offs</AlertDialogTitle>
          <AlertDialogDescription>
            Block specific dates or hours when you’re unavailable for bookings. 
            Clients won’t be able to book appointments during these time-off 
            periods on your profile page.
          </AlertDialogDescription>
          
          <div>
  <FieldGroup className="mx-auto lg:w-md w-sm flex-col">

    {/* DATE */}
    <Field>
      <FieldLabel htmlFor="date-picker-optional">
        Date
      </FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-optional"
            className="w-52 justify-between font-normal"
          >
            {dates ? format(dates) : "Select date"}

            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={dates}
            captionLayout="dropdown"
            defaultMonth={dates}
            onSelect={(selectedDate) => {
              setDates(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>

    {/* TIME */}
    <div className="flex gap-4 mt-4">

      <Field className="w-40">
        <FieldLabel>Start Time</FieldLabel>

        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="appearance-none bg-background"
        />
      </Field>

      <Field className="w-40">
        <FieldLabel>End Time</FieldLabel>

        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="appearance-none bg-background"
        />
      </Field>
    </div>

    {/* BUTTON */}
    <Button
      onClick={createTimeOff}
      disabled={loading}
      className="mt-5"
    >
      {loading ? "Creating..." : "Create Time Off"}
    </Button>

  </FieldGroup>
</div>



        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        </div>
      </div>

      {/* ALERT */}

      <div className="bg-pink-100 p-2 rounded-md mt-3">
        <p className="text-gray-500 flex items-center">
          <GoDotFill className="text-green-400" />

          Your availability is

          <span className="font-bold text-black ms-1 me-1">
            live
          </span>

          - clients can see your open time on your
          public profile and in the booking flow.
        </p>
      </div>

      {/* TABS */}

      <div className="mt-4">

        <Tabs defaultValue="calendar">

          <TabsList>
            <TabsTrigger value="calendar">
              Calendar View
            </TabsTrigger>

            <TabsTrigger value="day-view">
              Day View
            </TabsTrigger>
          </TabsList>

          {/* ================= CALENDAR ================= */}

          <TabsContent value="calendar">

            <CardHeader className="w-md">

              <div className="border border-gray-300 p-4 rounded-md mt-4 w-fit">

                {/* LEGEND */}

                <div className="flex gap-4 mb-4">

                  <div className="flex gap-1 items-center">
                    <GoDotFill className="text-green-600" />
                    <p className="text-gray-600">
                      Available
                    </p>
                  </div>

                  <div className="flex gap-1 items-center">
                    <GoDotFill className="text-pink-500" />
                    <p className="text-gray-600">
                      Booked
                    </p>
                  </div>

                  <div className="flex gap-1 items-center">
                    <GoDotFill className="text-gray-400" />
                    <p className="text-gray-600">
                      Unavailable
                    </p>
                  </div>

                </div>

                {/* CALENDAR */}

                <Calendar
//   mode="single"
  selected={date}
  onSelect={setDate}
  className="w-xl"

  modifiers={{
    booked: Object.entries(availabilityMap)
      .filter(([_, v]) => v.status === "booked")
      .map(([d]) => new Date(d)),

    unavailable: Object.entries(availabilityMap)
      .filter(([_, v]) => v.status === "unavailable")
      .map(([d]) => new Date(d)),

    available: Object.entries(availabilityMap)
      .filter(([_, v]) => v.status === "available")
      .map(([d]) => new Date(d)),
  }}

  modifiersClassNames={{
    booked:
      "border border-pink-500 bg-pink-100 rounded-md",

    unavailable:
      "border border-gray-600 bg-gray-300 rounded-md text-white",

    available:
      "border border-green-500 rounded-md",
  }}
/>

              </div>

            </CardHeader>

          </TabsContent>

          {/* ================= DAY VIEW ================= */}

          <TabsContent value="day-view" className="w-md">

            <Card>

              <CardHeader>

                <div>

                  <h2 className="font-bold text-2xl">
                    Today&#39;s Bookings
                  </h2>

                  {/* SAMPLE CARD */}

                 {todayBookings.length == 0 ?(
                    <div className="p-5 border border-dashed border-gray-300">

                        <p>No Bookings for today</p>

                    </div>
                 ): (
                    todayBookings.map((b) => (
                         <div className="border border-gray-200 p-4 w-sm rounded-md mt-4 flex flex-col gap-2" key={b.id}>

                    <div className="flex justify-between">

                      <div className="flex items-center gap-1">
                        <LuClock4 className="text-pink-500" />

                        <p className="font-bold">
                          {b.time.start}
                        </p>
                      </div>

                      <p className="text-gray-500">
                        {b.time.duration_min}
                      </p>

                    </div>

                    <div className="flex items-center gap-2">
                      <IoPersonOutline className="text-gray-500" />

                      <p className="font-bold">
                        {b.client.name}
                      </p>
                    </div>

                    <p className="text-gray-500">
                      {b.services.map(s => s.name).join(', ')}
                    </p>

                    {/* <div className="bg-gray-100 text-gray-500 p-2 rounded-md">
                      Wedding makeup for outdoor event
                    </div> */}

                  </div>
                    ))
                 )}

                </div>

              </CardHeader>

            </Card>

          </TabsContent>

        </Tabs>

      </div>

    </div>
  )
}