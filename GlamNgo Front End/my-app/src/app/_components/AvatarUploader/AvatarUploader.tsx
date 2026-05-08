'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LuUpload, LuTrash2 } from 'react-icons/lu'

interface Props {
  initialImageUrl?: string | null
  initialName?: string
  onChange?: (newImageUrl: string | null) => void
}

export default function AvatarUploader({ initialImageUrl, initialName, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null)
  const [bust, setBust] = useState(0)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initial = (initialName || '?')[0]?.toUpperCase()

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5 MB)', { position: 'top-center' })
      return
    }
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await fetch('/api/me/avatar', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        toast.error(data.msg || 'Upload failed', { position: 'top-center' })
        return
      }
      setImageUrl(data.image_url)
      setBust(Date.now())
      onChange?.(data.image_url)
      // Notify the navbar so the header avatar refreshes
      window.dispatchEvent(new Event('avatar-updated'))
      toast.success('Photo updated', { position: 'top-center' })
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!imageUrl) return
    if (!confirm('Remove your profile photo?')) return
    setBusy(true)
    try {
      const res = await fetch('/api/me/avatar', { method: 'DELETE' })
      if (res.ok) {
        setImageUrl(null)
        onChange?.(null)
        window.dispatchEvent(new Event('avatar-updated'))
        toast.success('Photo removed', { position: 'top-center' })
      } else {
        toast.error('Failed to remove photo', { position: 'top-center' })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='flex items-center gap-5'>
      <motion.div
        className='relative w-28 h-28 rounded-full overflow-hidden shadow-md ring-2 ring-pink-100'
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.25 }}
      >
        {imageUrl ? (
          <img
            src={`/uploads/${imageUrl}?v=${bust}`}
            alt='Profile'
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-linear-to-br from-pink-400 to-pink-600 text-white font-bold flex items-center justify-center text-5xl'>
            {initial}
          </div>
        )}
        {busy && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm'>
            …
          </div>
        )}
      </motion.div>

      <div className='flex flex-col gap-2'>
        <Button
          type='button'
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className='bg-pink-500 hover:bg-pink-600 text-white'
        >
          <LuUpload className='me-1' /> {imageUrl ? 'Change photo' : 'Upload photo'}
        </Button>
        {imageUrl && (
          <Button
            type='button'
            variant='outline'
            onClick={remove}
            disabled={busy}
            className='border-red-200 text-red-600 hover:bg-red-50'
          >
            <LuTrash2 className='me-1' /> Remove
          </Button>
        )}
        <p className='text-xs text-gray-400'>PNG / JPG / WEBP, up to 5 MB</p>
        <input
          aria-label="Upload avatar"
          ref={fileRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={e => {
            const f = e.target.files?.[0]
            if (f) upload(f)
            if (fileRef.current) fileRef.current.value = ''
          }}
        />
      </div>
    </div>
  )
}
