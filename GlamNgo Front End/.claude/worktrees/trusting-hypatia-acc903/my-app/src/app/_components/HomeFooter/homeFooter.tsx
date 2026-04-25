import Image from 'next/image'
import logo2 from '../../../../public/images/logo2.png'
import { Separator } from "@/components/ui/separator"



export default function HomeFooter() {
  return (
    <>
    <div className='bg-slate-800 py-4 text-white'>
      <div className='container w-[75%] mx-auto'>

      <div className='flex flex-wrap justify-between gap-2'>

        <div className='firstList flex flex-row lg:flex-col gap-3'>

           <Image src={logo2} alt='logo' loading='eager' className='w-28'/>

        <ul>
          <li className='max-w-70'>Book top-rated hair & makeup artists for weddings, events, and everyday glam.</li>
        </ul>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='font-bold text-xl'>For Customers</h3>
        <ul>
          <li>Find Artists</li>
          <li>AI Try-On</li>
          <li>Service Bundles</li>
          <li>How It Works</li>
        </ul>
      </div>


      <div className='flex flex-col gap-3'>
        <h3 className='font-bold text-xl'>For Artists</h3>
        <ul>
          <li>Become an Artist</li>
          <li>Artist Dashboard</li>
          <li>Pricing</li>
          <li>Resources</li>
        </ul>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='font-bold text-xl'>Support</h3>
        <ul>
          <li>Help Center</li>
          <li>Contact Us</li>
          <li>Privacy Policy</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      </div>

      </div>

       
    <div className='container w-[75%] mx-auto mt-3'>

    <Separator className='bg-gray-600' />

      <div className='flex justify-between items-center mt-3'>
        <p>© 2026 Glam Myfi. All rights reserved.</p>

        <div className='flex gap-3'>
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-twitter"></i>
        </div>

      </div>
    </div>

    </div>
    
    
    </>
  )
}
