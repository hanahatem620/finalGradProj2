'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'

import hair1 from '../../../../public/images/hair1.jpeg'
import hair2 from '../../../../public/images/hair2.jpeg'
import hair3 from '../../../../public/images/hair3.jpeg'
import { useEffect, useState } from 'react'
import { Packages2 } from '@/types/packages.type'



const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
  }),
}



export default function Bundels() {

  const [packages, setPackages] = useState<Packages2[]>([])

  const bundles = [ {img: hair1 },{ img: hair2 },{ img: hair3, } ]


   async function GetPackages() {
  try {
    const res = await fetch('/api/packages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    setPackages(data)
    
    return data;

  } catch (error) {
    console.error("Fetch payments error:", error);
    throw error;
  }
}

useEffect(() => {
  GetPackages();
}, []);



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
       {packages.map((pack, i) => (
  <motion.div
    key={pack?.id}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    custom={i}
    className="h-full"
  >
    <Card className="relative w-full h-full pt-0 overflow-hidden flex flex-col hover:shadow-xl transition-shadow">

      {/* IMAGE SECTION */}
      <div className="relative w-full aspect-video overflow-hidden">

        <Image
          src={bundles[i]?.img}
          alt={pack.name}
          className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700"
        />

        {/* TIER */}
        {pack.tier && (
          <span className="bg-pink-500 text-white absolute top-3 right-3 text-xs px-3 py-1 rounded-2xl">
            {pack.tier}
          </span>
        )}

        {/* TITLE OVER IMAGE */}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-xl drop-shadow-lg">
            {pack.name}
          </h3>
          <p className="text-xs opacity-95">
            {pack.description}
          </p>
        </div>
      </div>

      {/* PRICE */}
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl text-pink-500 font-bold">
          {pack.price} EGP
        </CardTitle>

        {/* ITEMS */}
        <CardDescription>
          <ul className="flex flex-col gap-2 mt-2">
            {pack.items?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>

      {/* BUTTON */}
      <CardFooter className="mt-auto">
        <Link href="/artists" className="w-full">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 rounded-full">
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
