'use client'
import { adminDashboard } from '@/adminActions/dashboard.action'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function Dashboard() {

     const {data: session} = useSession()
      // console.log(session);
      
      function logOut(){
        signOut({
          callbackUrl: "/LogIn"
        })
      }

      async function getDashboard(){
        const res = await adminDashboard()
        console.log(res);
        
      }

  return (
    <>
    <div>Dashboard</div>
    <div>
      <Button onClick={logOut} className='bg-white border border-red-300 w-full text-red-500 cursor-pointer'>Log Out</Button>
       </div>
    </>
  )
}
