'use client'
import Link from 'next/link'
import { RiHashtag } from "react-icons/ri";
import { CiCalendar } from "react-icons/ci";
import { IoBookOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import { LuCreditCard } from "react-icons/lu";
import { BsGear } from "react-icons/bs";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'
type AsideNavProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}





export default function AsideNav({open , setOpen} : AsideNavProps) {

const pathname = usePathname()
const activeClass = (path: string) =>
  pathname === path
    ? 'bg-pink-50 border border-pink-400 text-pink-600 rounded-md'
    : 'hover:bg-pink-100'


  return (
    <>
    
   {open &&  <Button onClick={()=> setOpen(false)} className='md:hidden fixed top-4 right-3 z-50 cursor-pointer'>
        <IoCloseSharp/>
    </Button>}

    <aside id="top-bar-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${open?  'translate-x-0' : '-translate-x-full'} md:translate-x-0 mt-10`} aria-label="Sidebar">
        <div className="h-full px-3 py-12 overflow-y-auto bg-neutral-primary-soft border-e border-pink-300 bg-white flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href={'/client/dashboard'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/dashboard')}`}>
                <RiHashtag className='text-xl'/>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link href={'/client/booking'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/booking')}`}>
                <CiCalendar className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">My Booking</span>
              </Link>
            </li>


            <li>
              <Link href={'/client/notifications'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/notifications')}`}>
                <IoBookOutline className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Notifications</span>
              </Link>
            </li>

            <li>
              <Link href={'/client/favorites'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/favorites')}`}>
                    <MdFavoriteBorder className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Favorites</span>
              </Link>
            </li>

            <li>
              <Link href={'/client/payment'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/payment')}`}>
                    <LuCreditCard className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
              </Link>
            </li>
          </ul>

           <ul className="space-y-2 font-medium">
            <li>
                <p className='text-gray-500 text-xs ms-3'>SUPPORT</p>
            </li>

            <li>
              <Link href={'/client/settings'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/settings')}`}>
                <BsGear className='text-xl'/>
                <span className="ms-3">Settings</span>
              </Link>
            </li>

            <li>
              <Link href={'/client/helpCenter'} className={`flex items-center px-2 py-1.5 text-body rounded-md hover:bg-pink-300 hover:rounded-md group ${activeClass('/client/helpCenter')}`}>
                <RxQuestionMarkCircled className='text-xl'/>
                <span className="flex-1 ms-3 whitespace-nowrap">Help center</span>
              </Link>
            </li>

          </ul>
        </div>
      </aside>
    
    </>
  )
}
