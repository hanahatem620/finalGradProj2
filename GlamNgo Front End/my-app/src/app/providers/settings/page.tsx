'use client'
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signOut, useSession } from 'next-auth/react'
import { GoPerson } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldContent,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { IoIosNotificationsOutline } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { GetProvider } from '@/types/getProvider';
import { toast } from 'sonner';
import AvatarUploader from '@/app/_components/AvatarUploader/AvatarUploader';




export default function providerSettings() {

  const [provider, setProvider] = useState<GetProvider | null>(null)
    const [saving, setSaving] = useState(false)
    const [name, setName] = useState('')
const [contact, setContact] = useState('')
const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<any>(null)

  

useEffect(() => {
  const load = async () => {
    const res = await fetch('/api/me')
    if (!res.ok) return

    const data = await res.json()

    setProvider(data)
    console.log(data)
  }

  load()
}, [])

async function save() {
  setSaving(true)

  try {
    const res = await fetch('/api/me/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name || provider?.name,
  email: email || provider?.email,
  contact_info: contact || provider?.contact_info,
      }),
    })

    const data = await res.json().catch(() => null)
    console.log(data)

    if (!res.ok) {
      toast(data?.msg || 'Failed to save', {
        position: 'top-center',
      })
      return
    }

    setProvider(data)
    toast.success('Profile updated successfully', {
      position: 'top-center',
    })
  } catch (err) {
    toast.error('Network error — try again', {
      position: 'top-center',
    })
  } finally {
    setSaving(false)
  }
}


     const {data: session} = useSession()
      function logOut(){
        signOut({
          callbackUrl: "/LogIn"
        })
      }
  return (
    <>
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-4'>

        <div>
            <h2 className='font-bold text-3xl'>Settings</h2>
            <p className='text-gray-500'>Manage Your account and preferences</p>
        </div>

        <div className='shadow-md rounded-md p-5 flex flex-col gap-3 '>

            <div className='flex items-center gap-2'>
                <div>
                    <GoPerson className='text-pink-500 bg-pink-100 p-2 w-fit rounded-md text-4xl'/>
                </div>

                <div>
                    <h2 className='font-bold'>Profile Settings</h2>
                    <p className='text-gray-500'>update your personal information</p>
                </div>
            </div>

            <Separator className='bg-gray-100'/>

            <div>
               <FieldGroup className='gap-2'>
  <Field>
    <FieldLabel>Full Name:</FieldLabel>
    <Input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder={provider?.name}
    />
  </Field>

  <Field>
    <FieldLabel>Email</FieldLabel>
    <Input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={provider?.email}
    />
  </Field>

  <Field>
    <FieldLabel>Phone</FieldLabel>
    <Input
      type="text"
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      placeholder={provider?.contact_info}
    />
  </Field>

  <Field orientation="horizontal">
    <Button
      type="button"
      onClick={save}
      className='bg-pink-500 text-white'
    >
      Save Changes
    </Button>
  </Field>
</FieldGroup>
            </div>

        </div>

        <div className='shadow-md rounded-md p-5 flex flex-col gap-3 '>

            <div className='flex items-center gap-2'>
                <div>
                    <GoPerson className='text-pink-500 bg-pink-100 p-2 w-fit rounded-md text-4xl'/>
                </div>

                <div>
                    <h2 className='font-bold'>Profile Photo</h2>
                    {/* <p className='text-gray-500'>Upload photos of your work (maximum 6 photos) </p> */}
                    <AvatarUploader
                              initialImageUrl={profile?.image_url ?? null}
                              initialName={session?.user?.name ?? 'A'}/>
                </div>
            </div>

            <Separator className='bg-gray-100'/>

            {/* <div>
                  <label className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 transition "
                  hidden>
      

      
    <FiUpload/>

      <p className="text-sm">Click or drag photos</p>

      <input
        type="file"
        multiple
        className="hidden"
      />
    </label>
            </div> */}
           

        </div>

        <div className='shadow-md rounded-md p-5 flex flex-col gap-3'>
                          <div className='flex items-center gap-2'>
                <div>
                    <IoIosNotificationsOutline className='text-pink-500 bg-pink-100 p-2 w-fit rounded-md text-4xl'/>
                </div>

                <div>
                    <h2 className='font-bold'>Notification</h2>
                    <p className='text-gray-500'>Manage Your notification preferences</p>
                </div>
            </div>

            <Separator className='bg-gray-100'/>
        
                <FieldGroup className="w-full">
                    <FieldLabel htmlFor="switch-share">
                <Field orientation="horizontal">
                  <FieldContent className='gap-0'>
                    <FieldTitle>New Bookings</FieldTitle>
                    <FieldDescription>
                     Get notified when a new booking is made
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-share" />
                </Field>
                    </FieldLabel>
        
                    <FieldLabel htmlFor="switch-share">
                <Field orientation="horizontal">
                  <FieldContent className='gap-0'>
                    <FieldTitle>Payment Updates</FieldTitle>
                    <FieldDescription>
                     Get notified about payment transactions
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-share" />
                </Field>
                    </FieldLabel>
        
                    {/* <FieldLabel htmlFor="switch-share">
                <Field orientation="horizontal">
                  <FieldContent className='gap-0'>
                    <FieldTitle>Promotions</FieldTitle>
                    <FieldDescription>
                     Stay updated on special offers and deals
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-share" />
                </Field>
                    </FieldLabel> */}
        

              </FieldGroup>
        
        
                    </div>




 <div>
                    <Button onClick={logOut} className='bg-pink-500 w-full text-white cursor-pointer'>Log Out</Button>
                </div>
    </div>
    </>
  )
}
