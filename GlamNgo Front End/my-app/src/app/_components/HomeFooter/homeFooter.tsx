'use client'
import Image from 'next/image'
import Link from 'next/link'
import logo2 from '../../../../public/images/logo2.png'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface Col {
  title: string
  items: { label: string; href: string }[]
}

const columns: Col[] = [
  {
    title: 'For Customers',
    items: [
      { label: 'Find Artists', href: '/artists' },
      { label: 'AI Try-On', href: '/aiFeatures' },
      { label: 'Service Bundles', href: '/' },
      { label: 'How It Works', href: '/howItWork' },
      { label: 'Our Services', href: '/ourService' },
      { label: 'Offers', href: '/offers' },
    ],
  },
  {
    title: 'For Artists',
    items: [
      { label: 'Become an Artist', href: '/becomeAPro' },
      { label: 'Artist Dashboard', href: '/artist' },
      { label: 'Apply as Pro', href: '/artistApp' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', href: '/client/helpCenter' },
      { label: 'Contact Us', href: '/contactUs' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
]

export default function HomeFooter() {
  const { data: session } = useSession()

  return (
    <footer className='bg-slate-900 py-10 text-white'>
      <div className='container w-[90%] lg:w-[80%] mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='flex flex-col gap-3'>
            <Image src={logo2} alt='logo' loading='eager' className='w-28 brightness-0 invert' />
            <p className='text-slate-300 max-w-xs text-sm'>
              Book top-rated hair &amp; makeup artists for weddings, events, and everyday glam.
            </p>
           
          </div>

          {columns.map(col => (
            <div key={col.title} className='flex flex-col gap-3'>
              <h3 className='font-bold text-lg'>{col.title}</h3>
              <ul className='space-y-2 text-sm text-slate-300'>
                {col.items.map(it => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className='hover:text-pink-400 transition-colors'
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className='bg-slate-700 my-6' />

        <div className='flex justify-between items-center flex-wrap gap-3'>
          <p className='text-slate-400 text-sm'>© 2026 GlamNgo. All rights reserved.</p>
          <div className='flex gap-4 text-slate-400'>
            <a href='#' aria-label='Facebook' className='hover:text-pink-400 transition-colors'>
              <i className='fa-brands fa-facebook text-lg' />
            </a>
            <a href='#' aria-label='Instagram' className='hover:text-pink-400 transition-colors'>
              <i className='fa-brands fa-instagram text-lg' />
            </a>
            <a href='#' aria-label='Twitter' className='hover:text-pink-400 transition-colors'>
              <i className='fa-brands fa-twitter text-lg' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
