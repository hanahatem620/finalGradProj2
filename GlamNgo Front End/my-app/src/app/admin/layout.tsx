'use client'

// Admin area is now a plain container — the navigation tabs live inline in
// the main Navbar (see _components/Navbar/navbar.tsx), so there's no sub-nav
// and no sidebar anymore.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-slate-50'>
      <main className='max-w-7xl mx-auto'>{children}</main>
    </div>
  )
}
