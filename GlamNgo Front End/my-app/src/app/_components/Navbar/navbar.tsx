'use client'
import Image from 'next/image'
import logo2 from '../../../../public/images/logo2.png'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MdHomeFilled } from 'react-icons/md'
import { BiSolidCategoryAlt } from 'react-icons/bi'
import { MdOutlinePalette } from 'react-icons/md'
import { LuCalendarCheck2 } from 'react-icons/lu'
import { usePathname } from 'next/navigation'

const HOME_TAB = { href: '/', label: 'Home', icon: MdHomeFilled }

const ADMIN_TABS = [
  { href: '/admin/dashboard', label: 'Overview', icon: BiSolidCategoryAlt },
  { href: '/admin/artists',   label: 'Artists',  icon: MdOutlinePalette },
  { href: '/admin/bookings',  label: 'Bookings', icon: LuCalendarCheck2 },
]

// const CLIENT_TABS = [
//   { href: '/artists',          label: 'Artists',   icon: MdOutlinePalette },
//   { href: '/client/dashboard', label: 'Dashboard', icon: BiSolidCategoryAlt },
//   { href: '/client/booking',   label: 'Bookings',  icon: LuCalendarCheck2 },
// ]

interface Tab { href: string; label: string; icon: any }

function TabLink({ tab, pathname }: { tab: Tab; pathname: string }) {
  const Icon = tab.icon
  const active = tab.href === '/'
    ? pathname === '/'
    : (pathname === tab.href || pathname.startsWith(tab.href + '/'))
  return (
    <Link
      href={tab.href}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
        active
          ? 'bg-pink-50 text-pink-600'
          : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
      }`}
    >
      <Icon className='text-base' />
      {tab.label}
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [avatarBust, setAvatarBust] = useState(0)

  const role = (session?.user as any)?.role?.toLowerCase()
  const isAdmin = role === 'admin' || role === 'manager'

  // Which tabs to show on the left, based on role
  const tabs: Tab[] = session
    ? [HOME_TAB, ...(isAdmin ? ADMIN_TABS :  [])]
    : []

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!session?.user) { setAvatarUrl(null); return }
    let cancelled = false
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (!cancelled) setAvatarUrl(u?.image_url || null) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [session?.user?.email, avatarBust])

  useEffect(() => {
    const h = () => setAvatarBust(x => x + 1)
    window.addEventListener('avatar-updated', h)
    return () => window.removeEventListener('avatar-updated', h)
  }, [])

  function logOut() { signOut({ callbackUrl: '/LogIn' }) }
  const initial = (session?.user?.name || session?.user?.email || '?')[0]?.toUpperCase()

  const ProfileMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className='flex items-center gap-2 border border-pink-200 bg-pink-50/60 hover:bg-pink-100 rounded-full px-2 py-1 transition'
          aria-label='Account menu'
        >
          <span className='w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-pink-600 text-white font-bold flex items-center justify-center text-sm'>
            {avatarUrl ? (
              <img
                src={`/uploads/${avatarUrl}?v=${avatarBust}`}
                alt=''
                className='w-full h-full object-cover'
              />
            ) : (
              initial
            )}
          </span>
          <span className='hidden md:block text-sm font-medium text-gray-700 me-1'>
            {session?.user?.name || 'Account'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <div className='text-xs text-gray-500 font-normal'>Signed in as</div>
          <div className='truncate text-sm'>{session?.user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={isAdmin ? '/admin/settings' : '/client/settings'}
              className='flex items-center gap-2 w-full'
            >
              <UserIcon className='w-4 h-4' /> Profile &amp; Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logOut}
          className='text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer flex items-center gap-2'
        >
          <LogOut className='w-4 h-4' /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <nav className='bg-white border-b border-pink-100 p-3 sticky top-0 z-50'>
      <div className='container w-full mx-auto flex justify-between items-center gap-4'>
        {/* Left: logo + role-aware tab row (Home first) */}
        <div className='flex items-center gap-6'>
          <Link href='/'>
            <Image
              src={logo2}
              loading='eager'
              width={100}
              height={100}
              className='w-28 object-contain'
              alt='GlamNgo'
            />
          </Link>

          {tabs.length > 0 && (
            <ul className='hidden lg:flex items-center gap-1'>
              {tabs.map(t => (
                <li key={t.href}>
                  <TabLink tab={t} pathname={pathname} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: guest links OR profile menu */}
        <div className='hidden md:flex items-center gap-3'>
          {status !== 'loading' && !session && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='border-0 shadow-none font-normal hover:bg-pink-50'>
                    Services <i className='fa-solid fa-angle-down ms-1' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild><Link href='/bookService'>Book a Service</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/offers'>Special offers</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/membership'>Membership</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/giftCard'>Gift cards</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/ourService'>Our services</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/howItWork'>How it works</Link></DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href='/artists' className='text-sm hover:text-pink-500'>Artists</Link>
              <Link href='/becomeAPro' className='text-sm hover:text-pink-500'>Become a Pro</Link>
              <Link href='/LogIn'>
                <Button variant='outline' className='border-pink-300 text-pink-600 hover:bg-pink-50'>
                  Log in
                </Button>
              </Link>
              <Link href='/LogIn'>
                <Button className='bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white'>
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {session && ProfileMenu}
        </div>

        {/* Mobile */}
        <div className='md:hidden flex items-center gap-2'>
          {session ? ProfileMenu : (
            <Link href='/LogIn'>
              <Button className='bg-pink-500 hover:bg-pink-600 text-white'>Log in</Button>
            </Link>
          )}
          <button className='cursor-pointer' onClick={() => setOpen(!open)} aria-label='Menu'>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className='md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t'>
          {session && tabs.map(t => (
            <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className='block py-1'>
              {t.label}
            </Link>
          ))}
          {!session && (
            <>
              <Link href='/artists' onClick={() => setOpen(false)} className='block py-1'>Artists</Link>
              <Link href='/ourService' onClick={() => setOpen(false)} className='block py-1'>Our Services</Link>
              <Link href='/howItWork' onClick={() => setOpen(false)} className='block py-1'>How It Works</Link>
              <Link href='/aiFeatures' onClick={() => setOpen(false)} className='block py-1'>AI Features</Link>
              <div className='pt-2 flex gap-2'>
                <Link href='/LogIn' onClick={() => setOpen(false)} className='flex-1'>
                  <Button variant='outline' className='w-full border-pink-300 text-pink-600'>Log in</Button>
                </Link>
                <Link href='/LogIn' onClick={() => setOpen(false)} className='flex-1'>
                  <Button className='w-full bg-pink-500 hover:bg-pink-600 text-white'>Sign up</Button>
                </Link>
              </div>
            </>
          )}
          {session && (
            <button onClick={logOut} className='block py-1 text-red-600 w-full text-left'>Log out</button>
          )}
        </div>
      )}
    </nav>
  )
}
