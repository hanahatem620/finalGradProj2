'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'

import bundle1 from '../../../../public/images/bundel1.jpg'
import bundle2 from '../../../../public/images/bundel2.jpg'
import bundle3 from '../../../../public/images/bundel3.jpg'

const bundles = [
  {
    img: bundle1,
    title: 'Bridal Glam Package',
    tag: 'Most popular',
    subtitle: 'Complete bridal transformation',
    price: '1500 EGP',
    perks: [
      'Professional bridal makeup',
      'Hair styling & updo',
      'Airbrush makeup application',
      'False lashes included',
      'Makeup touch-up kit',
      'Trial session included',
    ],
  },
  {
    img: bundle2,
    title: 'Event Ready Bundle',
    subtitle: 'Perfect for special occasions',
    price: '850 EGP',
    perks: [
      'Glamorous makeup look',
      'Professional hair styling',
      'Contouring & highlighting',
      'False lashes',
      'Setting spray application',
    ],
  },
  {
    img: bundle3,
    title: 'Hair & Makeup Express',
    subtitle: 'Quick glam for busy schedules',
    price: '500 EGP',
    perks: [
      'Natural makeup look',
      'Basic hair styling',
      'Blow-dry included',
      'Quick & efficient service',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function Bundels() {
  return (
    <div className='w-full py-6'>
      <motion.div
        className='flex flex-col items-center py-3 text-center'
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='font-bold text-3xl'>Hair &amp; Makeup Bundles</h1>
        <p className='text-gray-500'>Choose the perfect package for your special occasion</p>
      </motion.div>

      <div className='container w-[90%] lg:w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch'>
        {bundles.map((b, i) => (
          <motion.div
            key={b.title}
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.15 }}
            custom={i}
            whileHover={{ y: -5, transition: { duration: 0.25 } }}
            className='h-full'
          >
            <Card className='relative w-full h-full pt-0 overflow-hidden flex flex-col hover:shadow-xl transition-shadow'>
              <div className='relative w-full aspect-video overflow-hidden'>
                <Image
                  src={b.img}
                  alt={b.title}
                  className='w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700'
                />
                {b.tag && (
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                    className='bg-gradient-to-b from-pink-400 to-pink-500 w-fit p-1 rounded-2xl text-white font-semibold absolute top-3 right-3 text-xs px-3'
                  >
                    {b.tag}
                  </motion.span>
                )}
                <div className='absolute bottom-3 left-3 text-white'>
                  <h3 className='font-bold text-xl drop-shadow-lg'>{b.title}</h3>
                  <p className='text-xs opacity-95'>{b.subtitle}</p>
                </div>
              </div>

              <CardHeader className='pb-2'>
                <CardTitle className='text-3xl text-pink-500 font-bold'>{b.price}</CardTitle>
                <CardDescription>
                  <ul className='flex flex-col gap-2 mt-2'>
                    {b.perks.map(p => (
                      <li key={p} className='flex items-start gap-2 text-sm'>
                        <i className='fa-solid fa-check text-green-500 mt-1' />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardFooter className='mt-auto'>
                <Link href='/artists' className='w-full'>
                  <Button className='w-full bg-gradient-to-b from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 cursor-pointer rounded-full'>
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
