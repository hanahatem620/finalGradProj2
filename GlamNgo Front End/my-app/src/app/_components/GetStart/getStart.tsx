'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GetStart() {
  return (
    <motion.div
      className='py-16 bg-linear-to-b from-pink-100 via-pink-50 to-purple-100 relative overflow-hidden'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      {/* Ambient gradient blobs */}
      <motion.div
        className='absolute top-0 -left-20 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl'
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className='absolute bottom-0 -right-20 w-72 h-72 bg-purple-300/40 rounded-full blur-3xl'
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className='container w-[80%] mx-auto flex flex-col items-center gap-4 relative z-10'>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='font-bold text-4xl text-center'
        >
          Ready to Get Started?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-gray-600 text-center max-w-lg'
        >
          Join thousands of happy customers who trust us with their beauty needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link href='/artists'>
            <Button className='bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg'>
              Book Your First Service
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
