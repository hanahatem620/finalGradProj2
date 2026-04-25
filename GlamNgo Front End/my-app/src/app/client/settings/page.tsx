'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { LuUser, LuLogOut, LuImage } from 'react-icons/lu'
import AvatarUploader from '@/app/_components/AvatarUploader/AvatarUploader'

export default function ClientSettings() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(p => {
        if (!p) return
        setProfile(p)
        setName(p.name || '')
        setBio(p.bio || '')
        setLocation(p.location || '')
        setContact(p.contact_info || '')
      })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, location, contact_info: contact }),
      })
      if (res.ok) {
        setProfile(await res.json())
        toast.success('Profile updated', { position: 'top-center' })
      } else {
        toast.error('Failed to save', { position: 'top-center' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-6'>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='font-bold text-3xl'>Settings</h1>
        <p className='text-gray-500 text-sm'>Update your profile and preferences</p>
      </motion.div>

      {/* Profile photo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
      >
        <h2 className='font-bold text-lg mb-4 flex items-center gap-2'>
          <LuImage className='text-pink-500' /> Profile photo
        </h2>
        <AvatarUploader
          initialImageUrl={profile?.image_url ?? null}
          initialName={session?.user?.name ?? 'U'}
        />
      </motion.div>

      {/* Profile info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
      >
        <h2 className='font-bold text-lg mb-1 flex items-center gap-2'>
          <LuUser className='text-pink-500' /> Profile
        </h2>
        <p className='text-gray-500 text-sm mb-4'>
          This info appears to providers when you book.
        </p>

        {loading ? (
          <div className='animate-pulse space-y-3'>
            {[0, 1, 2, 3].map(i => <div key={i} className='h-10 bg-gray-100 rounded' />)}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-semibold'>Display name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className='text-sm font-semibold'>Email</label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div className='md:col-span-2'>
              <label className='text-sm font-semibold'>Bio</label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder='A short intro for providers you book with' />
            </div>
            <div>
              <label className='text-sm font-semibold'>Location</label>
              <Input value={location} onChange={e => setLocation(e.target.value)}
                placeholder='e.g. Zamalek, Cairo' />
            </div>
            <div>
              <label className='text-sm font-semibold'>Contact info</label>
              <Input value={contact} onChange={e => setContact(e.target.value)}
                placeholder='Phone or secondary contact' />
            </div>
          </div>
        )}

        <div className='flex gap-2 mt-4'>
          <Button
            className='bg-pink-500 hover:bg-pink-600'
            onClick={save}
            disabled={saving || loading}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
      >
        <h2 className='font-bold text-lg mb-3'>Account</h2>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-500'>Signed in as</p>
            <p className='font-semibold'>{session?.user?.email || '—'}</p>
          </div>
          <Button
            variant='outline'
            className='border-red-300 text-red-500 hover:bg-red-50'
            onClick={() => signOut({ callbackUrl: '/LogIn' })}
          >
            <LuLogOut className='me-1' /> Log out
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
