'use client'
import { motion } from 'framer-motion'
import { LuCreditCard, LuSparkles } from 'react-icons/lu'

const steps = [
  {
    n: 1,
    iconClass: 'fa-solid fa-magnifying-glass',
    title: 'Browse & Select',
    copy: 'Search through our verified makeup and hair artists. Filter by location, price, and specialty to find your perfect match.',
  },
  {
    n: 2,
    iconClass: 'fa-regular fa-calendar',
    title: 'Book Your Appointment',
    copy: 'Choose your preferred date and time. View real-time availability and book instantly with our easy scheduling system.',
  },
  {
    n: 3,
    node: <LuCreditCard className='text-pink-500 text-xl' />,
    title: 'Secure Payment',
    copy: 'Pay securely online or choose to pay after service. All transactions are protected and your payment information is safe.',
  },
  {
    n: 4,
    node: <LuSparkles className='text-pink-500 text-xl' />,
    title: 'Get Glam!',
    copy: 'Your artist arrives at your location or you visit their studio. Enjoy professional beauty services and look stunning!',
  },
]

const step = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function HowItWorks() {
  return (
    <div className='py-4 bg-white'>
      <div className='container lg:w-[90%] mx-auto md:w-[90%]'>
        <div className='flex flex-wrap flex-col md:flex-row items-stretch gap-7 p-10'>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={step}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
              className='howItCard bg-gradient-to-tl from-purple-50 to-pink-50 relative flex-1 w-3xs px-5 py-12 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-xl transition-shadow'
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                className='howItIcon bg-white w-fit p-3 rounded-full shadow shadow-gray-300'
              >
                {s.node ? s.node : <i className={`${s.iconClass} text-pink-500 text-xl`} />}
              </motion.div>
              <h3 className='font-bold text-xl'>{s.title}</h3>
              <p className='text-gray-600 max-w-60'>{s.copy}</p>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                className='absolute -top-6 -left-2 bg-gradient-to-b from-pink-400 to-pink-500 px-4 py-2 rounded-full shadow shadow-gray-500'
              >
                <p className='text-white font-semibold'>{s.n}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
