'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LuSearch } from 'react-icons/lu'
import { Provider } from '@/types/providerService.type'

// interface Provider {
//   id: number
//   email: string
//   name: string
//   role: string
//   bio: string | null
//   location: string | null
//   image_url: string | null
//   status: string
//   services: { id: number; title: string; base_price: number }[]
// }

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function AdminArtists() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/providers')
      .then(r => r.ok ? r.json() : [])
      .then(setProviders)
      .finally(() => setLoading(false))
  }, [])

  const filtered = providers.filter(p => {
    if (!q) return true
    const t = q.toLowerCase()
    return p.name.toLowerCase().includes(t) || p.email.toLowerCase().includes(t)
  })

  return (
   <div className='container lg:w-[80%] w-[90%] mx-auto'>
     <div className='px-4 lg:px-8 py-8 space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='text-3xl font-bold tracking-tight'>Artists</h1>
        <p className='text-gray-500 text-sm mt-1'>
          {providers.length} active provider{providers.length === 1 ? '' : 's'}
        </p>
      </motion.div>

      <div className='relative max-w-md'>
        <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder='Search by name or email'
          className='pl-9'
        />
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[0, 1, 2].map(i => (
            <div key={i} className='h-36 bg-white rounded-xl border border-gray-100 animate-pulse' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              custom={i}
              whileHover={{ y: -3 }}
              className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3'
            >
              <div className='flex gap-3 items-center'>
                {p.image_url ? (
                  <img
                    src={`/uploads/${p.image_url}`}
                    alt={p.name}
                    className='w-14 h-14 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-14 h-14 rounded-full bg-linear-to-br from-pink-400 to-pink-500 text-white font-bold flex items-center justify-center text-xl'>
                    {p.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold'>{p.name}</h3>
                    <Badge className={p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className='text-xs text-gray-500'>{p.email}</p>
                  <p className='text-xs text-pink-500 font-semibold'>
                    {p.role === 'artist' ? 'Makeup Artist' : 'Hair Stylist'}
                  </p>
                </div>
              </div>

              {p.location && (
                <p className='text-xs text-gray-500'>📍 {p.location}</p>
              )}

              <div>
                <p className='text-xs text-gray-400 uppercase mb-1'>Services</p>
                {p.services.length === 0 ? (
                  <p className='text-xs text-gray-400 italic'>None listed</p>
                ) : (
                  <div className='flex flex-wrap gap-1'>
                    {p.services.map(s => (
                      <span
                        key={s.id}
                        className='text-xs px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full border border-pink-200'
                      >
                        {s.title} · EGP {s.base_price}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
   </div>
  )
}
