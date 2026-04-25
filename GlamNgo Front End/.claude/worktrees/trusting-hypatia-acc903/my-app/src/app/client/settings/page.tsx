'use client'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldContent,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { getUser } from "@/profileActions/getUser.action"
import { User } from "@/types/user.type"
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from "react"




export default function ClientSettings() {

      const {data: session} = useSession()
      // console.log(session);
      
      function logOut(){
        signOut({
          callbackUrl: "/LogIn"
        })
      }


          const [user, setUser] = useState<User | null>(null)
      
      
      async function getLoggedUser(){
          const res = await getUser()
          setUser(res)
        console.log('USER' , user);
        console.log('RES' , res);
        console.log('SESSION' , session)
        // console.log('TOKEN' , token)
        // console.log('ACCESS_TOKEN' , access_token)
      
      
      }
      
      useEffect(() => {
      function flag(){
        getLoggedUser()
      }
      flag()
      },[])



  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>Settings</h1>
            <p className='text-gray-500 text-sm'>Manage your account preferences and privacy</p>
        </div>

       <div className='flex flex-col lg:flex-row gap-2'>

         <div className='lg:w-[70%] w-[90%] mx-auto p-2'>

            <div className='shadow-md rounded-lg p-4 mt-3'>

                <h1 className='font-bold mb-3'>Profile Infromation</h1>

                <div>
                    <form>
      <FieldGroup className='gap-1'>
        <Field className='gap-1'>
          <FieldLabel htmlFor="Full-Name" className='text-gray-600'>Full Name</FieldLabel>
          {/* <Input
            id="Full-Name"
            type="text"
          /> */}
          <p className="p-2 border border-gray-200 rounded-md shadow-xs ">{user?.name}</p>
        </Field>

        <Field className='gap-1'>
          <FieldLabel htmlFor="Email-Address" className='text-gray-600'>Email Address</FieldLabel>
          {/* <Input id="Email-Address" type="email" placeholder={user?.email} /> */}
          <p className="p-2 border border-gray-200 rounded-md shadow-xs ">{user?.email}</p>
        </Field>

          <Field className='gap-1'>
            <FieldLabel htmlFor="phone" className='text-gray-600'>Phone</FieldLabel>
            {/* <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" /> */}
            <p className="p-2 border border-gray-200 rounded-md shadow-xs ">{user?.phone || 'No phone Number'}</p>

          </Field>
      </FieldGroup>

      <Button className='bg-pink-500 text-white mt-3'>Save Changes</Button>

    </form>
                </div>

            </div>

            <div className='shadow-md rounded-lg p-4 mt-3'>
                <h1 className='font-bold text-xl mb-3'>Notification Preferences</h1>

        <FieldGroup className="w-full">
            <FieldLabel htmlFor="switch-share">
        <Field orientation="horizontal">
          <FieldContent className='gap-0'>
            <FieldTitle>Booking Confirmations</FieldTitle>
            <FieldDescription>
             Get notified when bookings are confirmed
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share" />
        </Field>
            </FieldLabel>

            <FieldLabel htmlFor="switch-share">
        <Field orientation="horizontal">
          <FieldContent className='gap-0'>
            <FieldTitle>Reminders</FieldTitle>
            <FieldDescription>
             Receive reminders before appointments
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share" />
        </Field>
            </FieldLabel>

            <FieldLabel htmlFor="switch-share">
        <Field orientation="horizontal">
          <FieldContent className='gap-0'>
            <FieldTitle>Promotions</FieldTitle>
            <FieldDescription>
             Stay updated on special offers and deals
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share" />
        </Field>
            </FieldLabel>

            <FieldLabel htmlFor="switch-share">
        <Field orientation="horizontal">
          <FieldContent className='gap-0'>
            <FieldTitle>Newsletter</FieldTitle>
            <FieldDescription>
             Get beauty tips and recommendations
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share" />
        </Field>
            </FieldLabel>

      </FieldGroup>


            </div>



        </div>



        <div className='lg:w-[40%] w-[60%] mx-auto p-2'>

            <div className='shadow-md rounded-xl p-4'>
                <div>
                    <h1 className='font-bold '>Account</h1>
                </div>

                <div className='flex flex-col gap-2'>

                <div className='border border-gray-200 p-1 rounded-md'>
                    <p className='text-gray-500'>Change Password</p>
                </div>

                <div className='border border-gray-200 p-1 rounded-md'>
                    <p className='text-gray-500'>Privacy Settings</p>
                </div>

                <div className='border border-gray-200 p-1 rounded-md'>
                    <p className='text-gray-500'>Connected Apps</p>
                </div>

                <div>
                    <Button onClick={logOut} className='bg-white border border-red-300 w-full text-red-500 cursor-pointer'>Log Out</Button>
                </div>

                </div>

            </div>

            <div className='bg-pink-200 p-3 rounded-xl mt-3 flex flex-col gap-1'>

                <h1 className='font-bold'>Need Help?</h1>
                <p className='text-gray-500 text-sm'>Visit our help center for FAQs and support</p>
                
                <div>
                    <Button>Get Support</Button>
                </div>

            </div>


        </div>
        
       </div>

     </div>

    </>
  )
}
