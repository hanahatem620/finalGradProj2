'use client'
import Link from 'next/link'
import { LuCalendarCheck2 } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdOutlinePalette } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineCreditCard } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";





type AsideNavProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}





export default function AsideNavAdmin({open , setOpen} : AsideNavProps) {




  return (
    <>
    
   {open &&  <Button onClick={()=> setOpen(false)} className='md:hidden fixed  top-4 right-3 z-50 cursor-pointer'>
        <IoCloseSharp/>
    </Button>}

    <aside id="top-bar-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${open?  'translate-x-0' : '-translate-x-full'} md:translate-x-0 mt-10`} aria-label="Sidebar">
        <div className="h-full px-3 py-12 overflow-y-auto bg-neutral-primary-soft border-e border-pink-300 bg-white flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href={'/admin/dashboard'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-pink-300 hover:text-fg-brand group">
                <BiSolidCategoryAlt />
                <span className="ms-3">Overview</span>
              </Link>
            </li>

            <li>
              <Link href={'/admin/artists'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                <MdOutlinePalette className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Artists</span>
              </Link>
            </li>

            <li>
              <Link href={'/admin/bookings'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <LuCalendarCheck2 className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Bookings</span>
              </Link>
            </li>

            <li>
              <Link href={'/admin/payment'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <MdOutlineCreditCard className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
              </Link>
            </li>

             <li>
              <Link href={'/admin/tickets'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <IoTicketOutline className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Tickets</span>
              </Link>
            </li>

             <li>
              <Link href={'/admin/applications'} className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                    <FaWpforms className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Application</span>
              </Link>
            </li>

            
          </ul>

        </div>
      </aside>
    
    </>
  )
}
