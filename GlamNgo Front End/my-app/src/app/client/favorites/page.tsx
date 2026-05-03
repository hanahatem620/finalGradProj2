'use client'
import Image from 'next/image'
import { FaStar } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import fallback from '../../../../public/images/artistPhoto.png'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {  Favorite } from '@/types/favourite.type';
import FavouriteBtn from '@/app/_components/FavouriteBtn/FavouriteBtn';
import { BsDot } from 'react-icons/bs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ProviderService } from '@/types/providerService.type';
import { toast } from 'sonner';





export default function clientFav() {

  const [favorites, setFavorites] = useState<Favorite[]>([]);


  function servicePills(services: ProviderService[]) {
    return services.slice(0, 2).map(s => s.title)
  }

  function startingFrom(services: ProviderService[]) {
    if (!services.length) return null
    return Math.min(...services.map(s => s.base_price))
  }

  function roleLabel(role: string) {
  if (role === 'artist')      return 'Makeup Artist'
  if (role === 'hairdresser') return 'Hair Stylist'
  return role[0]?.toUpperCase() + role.slice(1)
}

  const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

  async function GetFav() {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
      
    } catch (err) {
      console.log(err);
    }
  }


 

  useEffect(() => {
    GetFav();
  }, []);



  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>My Favorites</h1>
            <p className='text-gray-500 text-sm'>Your Saved artists and services for quick booking</p>
        </div>

          {favorites.length == 0 && (
        <motion.div  
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        className='p-10 border border-dotted border-gray-400 w-full'>
          <p className='text-gray-500 text-center'>No favorites yet</p>
        </motion.div>
    )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
     {favorites.map((p, i) => {
                const avatar   = p?.artist?.image ? `/uploads/${p?.artist?.image}` : null
                const pills    = servicePills(p?.services)
                const minPrice = startingFrom(p?.services)
                const rating   = p?.reviews?.average_stars ?? null
    
                return (
                  <motion.div
                    key={p?.artist?.id}
                    variants={fadeUp}
                    initial='hidden'
                    animate='visible'
                    custom={i}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className='h-full'
                  >
                    <Card className='relative w-full h-full pt-0 overflow-hidden flex flex-col gap-2 hover:shadow-xl transition-shadow'>
                      <div className='relative w-full aspect-4/3 bg-linear-to-br from-pink-100 to-pink-200'>
                        {avatar ? (
                          <img src={avatar} alt={p?.artist?.name} className='w-full h-full object-cover' />
                        ) : (
                          <Image
                            src={fallback}
                            alt={p?.artist?.name}
                            className='w-full h-full object-cover '
                            loading="eager"
                          />
                        )}
    
    
                        <FavouriteBtn
                        artistId={p.artist.id}
                        initialFav={true}
                        onRemove={() =>
                    setFavorites(prev =>
      prev.filter(f => f.artist.id !== p.artist.id)
    )
  }
/>
    
    
                        {rating !== null && (
                          <span className='bg-white/95 backdrop-blur p-1 rounded-2xl text-black font-semibold absolute top-3 right-3 text-xs flex items-center gap-1 px-2 shadow-sm'>
                            <i className='fa-solid fa-star text-yellow-400' />
                            <span>{rating.toFixed(1)}</span>
                            <span className='text-gray-400 font-normal'>({p?.reviews?.review_count})</span>
                          </span>
                        )}
                      </div>
    
                      <CardHeader className='flex flex-col gap-3 pt-0 flex-1'>
                        <CardTitle className='flex flex-col gap-1'>
                          <h3 className='font-bold line-clamp-1'>{p?.artist?.name}</h3>
                          <div className='flex text-gray-500 text-xs items-center'>
                            <span className='text-sm'>{roleLabel(p?.artist?.role)}</span>

                            {p?.artist?.location && (
                              <>
                                <BsDot />
                                <span className='truncate'>{p?.artist?.location}</span>
                              </>
                            )}
                          </div>

                          <p className='font-semibold text-pink-500'>{p.services[0].title}</p>

                            <div className='flex items-center gap-1'>
                                <FaStar className='text-yellow-500'/>
                                <p>{p?.reviews?.average_stars}</p>
                                <p className='text-sm text-gray-500'>({p?.reviews?.review_count} review)</p>
                            </div>
                        </CardTitle>
    
                        <CardDescription className='flex flex-col gap-3 min-h-6'>
                          <div className='flex flex-wrap gap-2'>
                            {pills.length > 0 ? (
                              pills.map(pl => (
                                <span key={pl} className='bg-pink-100 px-2 py-0.5 text-xs rounded-full text-pink-500'>
                                  {pl}
                                </span>
                              ))
                            ) : (
                              <span className='text-gray-400 text-xs'>No services listed yet</span>
                            )}
                          </div>
                        </CardDescription>
                        <Separator className='mt-auto' />
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
                        <Link href={`/artistPortfolio?id=${p.artist.id}`}>
                          <Button className='bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer rounded-full'>
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

    </>
  )
}
