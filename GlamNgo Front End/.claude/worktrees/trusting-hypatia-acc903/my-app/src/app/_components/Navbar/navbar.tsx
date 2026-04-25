'use client'
import Image from 'next/image'
import logo2 from '../../../../public/images/logo2.png'
import Link from 'next/link'
import { LuSparkles } from "react-icons/lu";
import {  useState } from 'react';
import { Menu, X } from "lucide-react"
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ServiceBookingBtn from '../ServiceBookingBtn/serviceBookingBtn';
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { MdHomeFilled } from "react-icons/md";
import AsideNav from '../../client/_component/AsideNav/AsideNav';
import { usePathname } from 'next/navigation';





export default function Navbar() {

  const [open, setOpen] = useState(false)
  const {data: session} = useSession()
  const pathname = usePathname()
  // const isDashboard = pathname.startsWith('/client') 
  const isDashboard =
  pathname.startsWith('/client') ||
  pathname.startsWith('/artist') ||
  pathname.startsWith('/admin')
  // console.log(session);
  
  function logOut(){
    signOut({
      callbackUrl: "/LogIn"
    })
  }

  





  return (
    <nav className='bg-white border border-pink-100 p-3 fixed inset-s-0 inset-e-0 top-0 z-50 '>

      <div className="container w-full mx-auto flex justify-between items-center">

        <div className='logo'>
          <Link href={"/"}>
            <Image
              src={logo2}
              loading="eager"
              width={100}
              height={100}
              className='w-28 object-contain'
              alt='logo'
            />
          </Link>
        </div>
<div className="links hidden md:block">
  <ul className="flex gap-8 items-center">

    {!session && (
      <>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-0 shadow-none font-normal hover:bg-white cursor-pointer text-md p-0 flex gap-0">
                Services
                <span><i className="fa-solid fa-angle-down"></i></span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/bookService">Book a Service</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/offers">SPECIAL OFFERS</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/membership">MEMBERSHIP</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/giftCard">GIFT CARDS</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/ourService">Our Services</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/howItWork">How It Works</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

        <li>
          <Link href="/becomeAPro">Become a Pro</Link>
        </li>

        <li>
          <Link href="/LogIn">Sign in</Link>
        </li>

        <li>
          <ServiceBookingBtn title="Book a Service" />
        </li>
      </>
    )}

    {session && isDashboard && (
      <>
        <li>
          <InputGroup className="max-w-xs">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </li>

        <li>
          <Link href="/">
            <MdHomeFilled className="text-3xl text-pink-600" />
          </Link>
        </li>
      </>
    )}

    {session && !isDashboard && (
  <>
    <li>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </li>

    <li>
      <Link href="/">
        <MdHomeFilled className="text-3xl text-pink-600" />
      </Link>
    </li>

    <li>
      <Link href="/client/dashboard" className="text-sm font-medium">
        Dashboard
      </Link>
    </li>
  </>
)}

  </ul>
</div>

       {!isDashboard && (
  <button
    className="md:hidden cursor-pointer"
    onClick={() => setOpen(!open)}
  >
    {open ? <X size={24} /> : <Menu size={24} />}
  </button>
)}

      </div>

      {open && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 border-t">

         {!session ? <>
           <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className='border-0 shadow-none font-normal hover:bg-white cursor-pointer text-md p-0 flex focus-visible:border-0 focus-visible:ring-0 gap-0'>Services
          <span><i className="fa-solid fa-angle-down"></i></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
           <DropdownMenuItem>
            <Link href={"/bookService"}>Book a Service</Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Link href={'/offers'}>SPECIAL OFFERS</Link>
          </DropdownMenuItem>
         
          <DropdownMenuItem>
            <Link href={"/membership"}>MEMBERSHIP</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/giftCard"}>GIFT CARDS</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/ourService"}>Our Services</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
               <Link href={"/howItWork"}>How It Works</Link>
          </DropdownMenuItem>


        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
             

         <Link href={"/Pro"} onClick={() => setOpen(false)} className="block">
            Become a Pro
          </Link>

          <Link href={"/LogIn"} onClick={() => setOpen(false)} className="block">
            Sign in
          </Link>  </> : ""
          }

          

        </div>
      )}

    </nav>
  )
}
