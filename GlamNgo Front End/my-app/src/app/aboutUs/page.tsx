'use client'
import Image from 'next/image'
import hero from '../../../public/images/hero.jpg'
import { TbDiamondFilled } from "react-icons/tb";
import { FaHandshakeSimple } from "react-icons/fa6";
import { HiRocketLaunch } from "react-icons/hi2";
import hero4 from '../../../public/images/hero4.png'
import GetStart from '../_components/GetStart/getStart';
import { motion } from 'framer-motion'
import { IoStar } from "react-icons/io5";







export default function AboutUs() {
  return (
    <>
    <div className='bg-linear-to-l from-pink-50 to-purple-50 py-20'>
        <div className='text-center'>
            <h2 className='text-4xl font-bold'>About GlamNgo</h2>
            <p className='text-gray-500 max-w-140 mx-auto'>Connecting beauty enthusiasts with top-rated hair and makeup artists for every occasion. We're revolutionizing the beauty industry one appointment at a time.</p>
        </div>
    </div>

    <div className='bg-white h-full'>
       <div className='container w-[90%] mx-auto py-5'>
         <motion.div className='flex justify-between flex-col lg:flex-row'
         initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
         >

        <div className='mt-5'>
            <h3 className='font-bold text-3xl'>Our Mission</h3>
            <p className='text-gray-500 max-w-125'>At GlamNgo, we believe everyone deserves to look and feel their best. 
                Our platform makes it easy to discover and book talented beauty professionals 
                who bring their expertise right to your doorstep.</p>
                <p className='text-gray-500 max-w-130 mt-4'>We're committed to empowering artists with the tools they need to grow their business 
                    while providing customers with seamless, reliable beauty services for 
                    weddings, events, and everyday glam.</p>

        </div>

        <div className="mt-5 relative inline-block ">
            <Image
                src={hero}
                alt="hero image"
                width={500}
                height={500}
                className="w-full h-auto rounded-xl block"
                />

  <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-xl flex items-end">
    <p className="text-white font-bold text-2xl p-6">
      Beauty Made Simple
    </p>
  </div>

        </div>

        </motion.div>
       </div>

    </div>

    <div className='container w-[90%] mx-auto py-15'>

        <h3 className='font-bold text-3xl text-center mb-4'>Our Values</h3>

        <div className='flex flex-wrap lg:justify-between justify-center gap-2'>


            <motion.div className='p-5 rounded-md shadow-md border border-gray-100 w-sm'
            initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
            >
                <TbDiamondFilled className='bg-pink-200 text-4xl p-2 rounded-full text-blue-400'/>
                <h3 className='font-bold '>Quality First</h3>
                <p className='text-gray-500 max-w-70'>We partner with verified, professional artists who deliver exceptional results every time.</p>

            </motion.div>

             <motion.div className='p-5 rounded-md shadow-md border border-gray-100 w-sm'
             initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
             >
                <FaHandshakeSimple className='bg-gray-200 text-4xl p-2 rounded-full text-yellow-400'/>
                <h3 className='font-bold '>Trust & Safety</h3>
                <p className='text-gray-500 max-w-70'>
                    Your peace of mind matters. All artists are vetted and services are backed by our guarantee.
                </p>

            </motion.div>

             <motion.div className='p-5 rounded-md shadow-md border border-gray-100 w-sm'
             initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
             >
                <HiRocketLaunch className='bg-pink-200 text-4xl p-2 rounded-full text-red-400'/>
                <h3 className='font-bold '>Innovation</h3>
                <p className='text-gray-500 max-w-70'>
                    From AI try-on to smart scheduling, we use technology 
                    to enhance your beauty experience.
                </p>

            </motion.div>


        </div>


    </div> 

    <div className='bg-white h-full'>
       <div className='container w-[90%] mx-auto py-5'>
         <motion.div className='flex lg:flex-row-reverse justify-between flex-col '
         initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
         >

        <div className='mt-5'>
            <h3 className='font-bold text-3xl'>Our Vision</h3>
            <p className='text-gray-500 max-w-125'>At GlamNgo, our vision is to make beauty and self-care easy, 
                accessible, and enjoyable for everyone. We aim to connect clients with 
                the best beauty professionals in a simple and seamless way.</p>
                <p className='text-gray-500 max-w-130 mt-4'>We believe that everyone deserves to feel 
                    confident and beautiful without wasting time or effort. That’s why we’re building a 
                    platform that saves time, offers trusted options, and delivers a smooth booking 
                    experience.</p>
                    <p className='text-gray-500 max-w-130 mt-4'>Our goal is to become the go-to platform for beauty services, 
                        where quality, convenience, and style come 
                        together in one place.</p>

        </div>

        <div className="mt-5 relative inline-block ">
            <Image
                src={hero4}
                alt="hero image"
                width={500}
                height={500}
                className="w-full h-auto rounded-xl block"
                />

  <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-xl flex items-end">
    <p className="text-white font-bold text-2xl p-6">
      Beauty Made Simple
    </p>
  </div>

</div>

        </motion.div>
       </div>

    </div>

    <GetStart/>
    
    <div className='bg-linear-to-br from-pink-500 to-purple-500 py-15'>

        <div className='container w-[70%] mx-auto flex justify-between text-center'>

        <div className='text-white'>
            <h3 className='font-bold text-2xl'>500+</h3>
            <p>Verified Artist</p>
        </div>

         <div className='text-white'>
            <h3 className='font-bold text-2xl'>10K+</h3>
            <p>Happy Customers</p>
        </div>

         <div className='text-white'>
            <h3 className='font-bold text-2xl'>25+</h3>
            <p>Cities Served</p>
        </div>

         <div className='text-white'>
            <h3 className='font-bold text-2xl flex items-center gap-2'>4.9 <IoStar/></h3>
            <p>Average Rating</p>
        </div>

        </div>

    </div>


    </>
  )
}
