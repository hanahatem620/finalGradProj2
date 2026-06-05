'use client'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { MdDateRange } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Button } from '@/components/ui/button';
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookDetails } from '@/types/bookDetails.type';
import fallback from '../../../../../public/images/artistPhoto.png'
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
import { LuMessageCircleMore } from 'react-icons/lu';
import { Separator } from '@/components/ui/separator';


export default function BookingDetails() {

 const [loading, setLoading] = useState(true);
const [booking, setBooking] = useState<BookDetails | null>(null);

const params = useParams();
const bookingId = Number(params.id);

useEffect(() => {
  const id = Number(params.id);

  if (!id || isNaN(id)) return;

  async function load() {
    try {
      const res = await fetch(`/api/bookingDetails/${bookingId}`);

      const data = await res.json();

      console.log("DATA:", data);

      setBooking(data);
    } catch (err) {
        (err)
    }
  }

  load();
}, [params.id]);

 const getInitials = (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const avatar = booking?.artist?.image ? `/uploads/${booking?.artist?.image}` : null

  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>
        <div>
            <h1 className='font-bold text-3xl'>Booking Details</h1>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>

        <div className='lg:w-[50%]'>

            <div className='bg-white p-5 rounded-md shadow-md'>
            <div className='flex gap-2'>
                <div>
                    {avatar ? (
            <img
              src={avatar}
              alt={booking?.artist?.name}
              width={120}
              height={120}
              className='rounded-full object-cover aspect-square'
            />
          ) : (
            <Image
              src={fallback}
              alt={ "Artist Avatar"}
              width={100}
              height={100}
              loading='eager'
              className='rounded-full object-cover aspect-square'
            />
          )}
                </div>

                <div>
                    <h1 className='font-bold text-lg'>{booking?.artist?.name}</h1>
                    <p className='text-gray-500 text-sm'>{booking?.services[0]?.name}</p>
                    <Badge className='bg-yellow-200 text-yellow-500'>Pending confirmation</Badge>
                </div>

            </div>

            <div className='bg-yellow-200 border border-amber-400 p-2 rounded-md text-yellow-500 mt-3 flex items-center gap-2 text-sm'>
                <i className="fa-solid fa-star"></i>
                <p>Waiting for artist confirmation. You'll be notified once the artist accepts your booking request.</p>
            </div>

            <div className='mt-3'>
                 <ul>
                <li>
                    <span className='flex items-center text-gray-500 text-sm'><MdDateRange className='me-1'/> Date</span>
                    <h3 className='ms-4 font-bold'>{booking?.date}</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><MdAccessTime className='me-1'/> Time</span>
                    <h3 className='ms-4 font-bold'>{booking?.time.from} - {booking?.time.to}</h3>
                </li>

                <li>
                    <span className='flex items-center text-gray-500 text-sm'><CiLocationOn className='me-1'/>Location</span>
                    <h3 className='ms-4 font-bold'>{booking?.artist?.location || "Glam Studio, Downtown"}</h3>
                </li>


            </ul>
            </div>

            </div>

            <div className='bg-white rounded-md shadow-md p-5 flex flex-col gap-3 mt-5'>
                <div>
                    <h1 className='font-bold text-2xl'>Service Details</h1>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Service</h3>
                    <p className='font-bold '>{booking?.services[0]?.name}</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Description</h3>
                    <p className='font-bold '>Professional hair coloring service with a precision cut. Includes consultation, color application, styling, and aftercare advice. Perfect for a fresh new look or maintaining your current style.</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Duration</h3>
                    <p className='font-bold '>{booking?.services[0]?.duration}</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>Price</h3>
                    <p className='font-bold '>{booking?.services[0]?.price?.toFixed(2)}</p>
                </div>

                <div>
                    <h3 className='text-gray-500 text-sm'>What's included</h3>

                    <div>
                         <ul className="flex flex-col gap-1">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Color consultation</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Premium color application</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Precision haircut</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Styling & blow dry</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Hair care product samples</span>
        </li>

          </ul>
                    </div>
                </div>

            </div>

        </div>

        <div className='lg:w-[50%]'>
            <div className='flex lg:flex-col flex-col-reverse  gap-2'>

            <div className='bg-white p-5 shadow-md rounded-md'>
                <h1 className='font-bold mb-2'>Actions</h1>

                <div className='flex flex-col gap-2 '>
                    <div>
                        <AlertDialog >
                  <AlertDialogTrigger asChild>
                    <Button className="bg-pink-100 text-pink-500 hover:bg-pink-50 w-full flex-3">
                      <LuMessageCircleMore/>
                      Contact Artist</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader className="flex flex-col gap-3">
                      <AlertDialogTitle>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="bg-pink-50 text-pink-500 p-2 rounded-full w-fit">{getInitials(booking?.artist?.name || 'Artist')}</p>
                          </div>
            
                          <div>
                            <h2 className="font-bold">{booking?.artist?.name}</h2>
                            <h3 className="text-gray-500 text-xs">{booking?.artist?.email}</h3>
                          </div>
                        </div>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="w-full mt-3" asChild>
                        <div className="text-center flex flex-col items-center gap-2">
                          <p className="font-bold text-black text-2xl"> Contact <span>{booking?.artist?.name}</span></p>
                       {booking?.artist?.contact ? (
              <>
                <h3 className="bg-gray-100 text-black p-3 rounded-md">
                  {booking?.artist.contact}
                </h3>
            
                <a
                  href={`tel:${booking?.artist.contact}`}
                  className="bg-pink-500 p-3 rounded-md text-white"
                >
                  Call Now
                </a>
              </>
            ) : (
              <>
                <h3 className="bg-gray-100 text-black p-3 rounded-md">
                  {booking?.artist?.email}
                </h3>
            
                <a
                  href={`mailto:${booking?.artist?.email}`}
                  className="bg-pink-500 p-3 rounded-md text-white"
                >
                  Contact via Email
                </a>
              </>
            )}
            <Separator className="mt-4 mb-4"/>
            <p className="bg-gray-100 text-gray-500 p-3 rounded-md">You can reach {booking?.artist?.name} directly for booking inquiries and updates</p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                    </div>
                    {/* <Button className='border border-gray-300 bg-white w-xs text-black'>Modify Request</Button>
                    <Button className='border border-gray-300 bg-white w-xs text-black'>Cancel Request</Button> */}
                </div>

            </div>

            <div className='bg-white p-5 shadow-md rounded-md flex flex-col gap-2'>
                <h1 className='font-bold'>About {booking?.artist?.name}</h1>
                <div className='flex items-center gap-2'>
                    <FaStar className='text-yellow-300'/>
                    <p className='font-bold '>{booking?.artist.reviews.average_stars}</p>
                    <p className='text-gray-500'>({booking?.artist?.reviews?.review_count} reviews)</p>
                </div>

                    <p className='text-gray-500 max-w-85'>Professional hair stylist with 10+ years of experience specializing in color treatments and precision cuts.</p>
            </div>

            </div>
        </div>


        </div>
     </div>
    </>
  )
}
