'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GiHamburgerMenu } from "react-icons/gi";
import AsideNav from "./_component/AsideNav/AsideNav";


export default function ClientLayout({children,}: { children: React.ReactNode}) {
  const [open,setOpen] = useState(false)


  return (
    <div className="flex min-h-screen">
        <Button onClick={()=> setOpen(true)} className="md:hidden bg-linear-to-b from-pink-400 to-pink-500 text-white fixed top-4 right-3 z-50 p-2 cursor-pointer">
            <GiHamburgerMenu />
        </Button>

      <AsideNav open={open} setOpen={setOpen} />

      <main className="flex-1 lg:ml-40 bg-white min-h-screen">
        {children}
      </main>

    </div>
  )
}