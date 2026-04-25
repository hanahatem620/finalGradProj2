'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BsDot } from 'react-icons/bs'
import fallbackPhoto from '../../../public/images/artistPhoto.png'

interface ProviderService {
  id: number
  title: string
  type: string
  duration: number
  base_price: number
}

interface Provider {
  id: number
  email: string
  name: string
  role: string
  bio: string | null
  location: string | null
  image_url: string | null
  services: ProviderService[]
}

interface ProviderWithRating extends Provider {
  avg_rating: number | null
  review_count: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

function roleLabel(role: string) {
  if (role === 'artist') return 'Makeup Artist'
  if (role === 'hairdresser') return 'Hair Stylist'
  return role[0]?.toUpperCase() + role.slice(1)
}

function servicePills(services: ProviderService[]) {
  return services.slice(0, 2).map(s => s.title)
}

function startingFrom(services: ProviderService[]) {
  if (!services.length) return null
  return Math.min(...services.map(s => s.base_price))
}

export default function Artists() {
  const [providers, setProviders] = useState<ProviderWithRating[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/providers')
        if (!res.ok) throw new Error('failed')
        const rows: Provider[] = await res.json()
        const enriched = await Promise.all(
          rows.map(async p => {
            try {
              const r = await fetch(`/api/reviews/provider/${p.id}`)
              if (!r.ok) return { ...p, avg_rating: null, review_count: 0 }
              const j = await r.json()
              return { ...p, avg_rating: j.average, review_count: j.count }
            } catch {
              return { ...p, avg_rating: null, review_count: 0 }
            }
          }),
        )
        if (!cancelled) setProviders(enriched)
      } catch {
        if (!cancelled) setError(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className='py-6 w-full bg-gradient-to-b from-white to-pink-50/40'>
      <div className='container w-[90%] lg:w-[85%] mx-auto'>
        <motion.div
          className='artistsText flex justify-between items-center'
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className='font-bold text-3xl'>Artists</h1>
            <p className='text-gray-500'>Top-rated professionals ready to serve you</p>
          </div>
          <div>
            <Button variant='ghost' className='text-pink-500 hover:text-pink-600 cursor-pointer'>
              view all &gt;
            </Button>
          </div>
        </motion.div>

        <div className='artistCard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5'>
          {providers === null && !error && (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='animate-pulse rounded-xl bg-white/60 border border-gray-200 h-[380px]' />
            ))
          )}

          {error && (
            <div className='col-span-full text-center py-10 text-gray-500'>
              Couldn&apos;t load artists. Please refresh.
            </div>
          )}

          {providers && providers.length === 0 && (
            <div className='col-span-full text-center py-10 text-gray-500'>
              No artists available yet — check back soon!
            </div>
          )}

          {providers && providers.map((p, i) => {
            const avatar = p.image_url ? `/uploads/${p.image_url}` : null
            const pills = servicePills(p.services)
            const minPrice = startingFrom(p.services)
            const rating = p.avg_rating ?? null
            return (
              <motion.div
                key={p.id}
                variants={fadeUp}
                initial='hidden'
                animate='visible'
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <Card className='relative w-full pt-0 overflow-hidden flex flex-col gap-2 hover:shadow-xl transition-shadow'>
                  <div className='relative w-full aspect-[4/3] bg-gradient-to-br from-pink-100 to-pink-200'>
                    {avatar ? (
                      <img src={avatar} alt={p.name} className='w-full h-full object-cover' />
                    ) : (
                      <Image
                        src={fallbackPhoto}
                        alt={p.name}
                        className='w-full h-full object-cover'
                      />
                    )}
                    {rating !== null && (
                      <span className='bg-white/95 backdrop-blur p-1 rounded-2xl text-black font-semibold absolute top-3 right-3 text-xs flex items-center gap-1 px-2 shadow-sm'>
                        <i className='fa-solid fa-star text-yellow-400'></i>
                        <span>{rating.toFixed(1)}</span>
                        <span className='text-gray-400 font-normal'>({p.review_count})</span>
                      </span>
                    )}
                  </div>

                  <CardHeader className='flex flex-col gap-3 pt-0'>
                    <CardTitle className='flex flex-col gap-1'>
                      <h3 className='font-bold'>{p.name}</h3>
                      <div className='flex text-gray-500 text-xs items-center'>
                        <span>{roleLabel(p.role)}</span>
                        {p.location && (
                          <>
                            <BsDot />
                            <span>{p.location}</span>
                          </>
                        )}
                      </div>
                    </CardTitle>

                    <CardDescription className='flex flex-col gap-3'>
                      <div className='flex flex-wrap gap-2'>
                        {pills.length > 0 ? (
                          pills.map(pl => (
                            <span
                              key={pl}
                              className='bg-pink-100 px-2 py-0.5 text-xs rounded-full text-pink-500'
                            >
                              {pl}
                            </span>
                          ))
                        ) : (
                          <span className='text-gray-400 text-xs'>No services listed yet</span>
                        )}
                      </div>
                    </CardDescription>
                    <Separator />
                  </CardHeader>

                  <CardFooter className='flex justify-between items-center'>
                    <p className='font-bold text-pink-500 text-lg'>
                      {minPrice !== null ? (
                        <>
                          <span className='text-xs text-gray-500 font-normal me-1'>from</span>
                          {minPrice.toFixed(0)} EGP
                        </>
                      ) : (
                        <span className='text-sm text-gray-400 font-normal'>—</span>
                      )}
                    </p>
                    <Link href={`/artistPortfolio?id=${p.id}`}>
                      <Button className='bg-gradient-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full'>
                        Book Now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
