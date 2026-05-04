'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Briefcase,
  Mail,
  Phone,
  Instagram,
  Globe,
  Award,
  Check,
  X,
  ExternalLink,
} from 'lucide-react'

interface Application {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  years_of_experience: number | null
  specialties: string[]
  certifications: string | null
  license: string | null
  services: string[]
  price_range: number | null
  travel_range: number | null
  portfolio_description: string | null
  instagram: string | null
  website: string | null
  id_card_url: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reject_reason: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  created_at: string
}

type Summary = { PENDING: number; APPROVED: number; REJECTED: number }

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-700 border-green-300',
  REJECTED: 'bg-red-100 text-red-700 border-red-300',
}

function fmt(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([])
  const [summary, setSummary] = useState<Summary>({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [rejecting, setRejecting] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/artist-applications', { cache: 'no-store' })
      if (!r.ok) {
        toast.error('Failed to load applications')
        return
      }
      const data = await r.json()
      setApps(data.applications || [])
      setSummary(data.summary || { PENDING: 0, APPROVED: 0, REJECTED: 0 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function approve(app: Application) {
    if (busyId) return
    setBusyId(app.id)
    try {
      const r = await fetch(`/api/artist-applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to approve')
        return
      }
      toast.success(`Approved ${app.first_name} — artist account ready.`)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  async function reject() {
    if (!rejecting || busyId) return
    setBusyId(rejecting.id)
    try {
      const r = await fetch(`/api/artist-applications/${rejecting.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason: rejectReason }),
      })
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to reject')
        return
      }
      toast.success('Application rejected')
      setRejecting(null)
      setRejectReason('')
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const filtered = tab === 'ALL' ? apps : apps.filter(a => a.status === tab)

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto px-4 lg:px-8 py-8 space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className='flex items-center gap-2 text-pink-500 mb-1'>
          <Briefcase className='w-4 h-4' />
          <span className='text-xs font-semibold uppercase tracking-wider'>
            Artist Applications
          </span>
        </div>
        <h1 className='text-3xl font-bold tracking-tight'>Pending Reviews</h1>
        <p className='text-gray-500 text-sm mt-1'>
          {summary.PENDING} pending · {summary.APPROVED} approved · {summary.REJECTED} rejected
        </p>
      </motion.div>

      <Tabs value={tab} onValueChange={v => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value='PENDING'>
            Pending {summary.PENDING > 0 && `(${summary.PENDING})`}
          </TabsTrigger>
          <TabsTrigger value='APPROVED'>Approved</TabsTrigger>
          <TabsTrigger value='REJECTED'>Rejected</TabsTrigger>
          <TabsTrigger value='ALL'>All</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className='mt-4'>
          {loading ? (
            <div className='space-y-3'>
              {[0, 1].map(i => (
                <div
                  key={i}
                  className='h-40 bg-white rounded-xl border border-gray-100 animate-pulse'
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className='border border-dashed border-gray-300 rounded-xl p-16 text-center text-gray-500'>
              No {tab.toLowerCase()} applications.
            </div>
          ) : (
            <div className='space-y-4'>
              {filtered.map(app => (
                <motion.article
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'
                >
                  <header className='flex items-start justify-between gap-4 flex-wrap'>
                    <div>
                      <div className='flex items-center gap-3'>
                        <h2 className='font-bold text-lg'>
                          {app.first_name} {app.last_name}
                        </h2>
                        <Badge
                          variant='outline'
                          className={STATUS_STYLES[app.status] || ''}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        Submitted {fmt(app.created_at)}
                        {app.reviewed_at && ` · reviewed ${fmt(app.reviewed_at)}`}
                      </p>
                    </div>
                    {app.status === 'PENDING' && (
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => approve(app)}
                          disabled={busyId !== null}
                          className='bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                        >
                          <Check className='w-4 h-4 me-1' /> Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setRejecting(app)
                            setRejectReason('')
                          }}
                          disabled={busyId !== null}
                          variant='outline'
                          className='border-red-300 text-red-600 hover:bg-red-50 cursor-pointer'
                        >
                          <X className='w-4 h-4 me-1' /> Reject
                        </Button>
                      </div>
                    )}
                  </header>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm'>
                    <div className='space-y-2'>
                      <Row icon={<Mail className='w-4 h-4' />} label='Email' value={app.email} />
                      {app.phone && (
                        <Row icon={<Phone className='w-4 h-4' />} label='Phone' value={app.phone} />
                      )}
                      {app.instagram && (
                        <Row
                          icon={<Instagram className='w-4 h-4' />}
                          label='Instagram'
                          value={`@${app.instagram.replace(/^@/, '')}`}
                        />
                      )}
                      {app.website && (
                        <Row
                          icon={<Globe className='w-4 h-4' />}
                          label='Website'
                          value={app.website}
                        />
                      )}
                    </div>
                    <div className='space-y-2'>
                      {app.years_of_experience != null && (
                        <Row
                          icon={<Award className='w-4 h-4' />}
                          label='Experience'
                          value={`${app.years_of_experience} year${app.years_of_experience === 1 ? '' : 's'}`}
                        />
                      )}
                      {app.price_range != null && app.price_range > 0 && (
                        <Row label='Starts at' value={`$${app.price_range}`} />
                      )}
                      {app.travel_range != null && app.travel_range > 0 && (
                        <Row label='Travel range' value={`${app.travel_range} miles`} />
                      )}
                      {app.license && (
                        <Row label='License' value={app.license} />
                      )}
                    </div>
                  </div>

                  {(app.specialties?.length || app.services?.length) ? (
                    <div className='mt-4 space-y-2'>
                      {app.specialties?.length > 0 && (
                        <ChipList label='Specialties' items={app.specialties} tone='pink' />
                      )}
                      {app.services?.length > 0 && (
                        <ChipList label='Services' items={app.services} tone='purple' />
                      )}
                    </div>
                  ) : null}

                  {app.portfolio_description && (
                    <div className='mt-4'>
                      <p className='text-xs text-gray-500 uppercase mb-1'>Portfolio</p>
                      <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                        {app.portfolio_description}
                      </p>
                    </div>
                  )}

                  {app.certifications && (
                    <div className='mt-3'>
                      <p className='text-xs text-gray-500 uppercase mb-1'>Certifications</p>
                      <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                        {app.certifications}
                      </p>
                    </div>
                  )}

                  {app.id_card_url && (
                    <div className='mt-4'>
                      <a
                        href={`/uploads/${app.id_card_url}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-pink-600 text-sm hover:underline'
                      >
                        <ExternalLink className='w-3 h-3' />
                        View ID document
                      </a>
                    </div>
                  )}

                  {app.status === 'REJECTED' && app.reject_reason && (
                    <p className='mt-4 text-sm text-red-600 italic border-l-2 border-red-300 ps-3'>
                      Rejected: {app.reject_reason}
                    </p>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejecting} onOpenChange={open => !open && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejecting?.first_name}&apos;s application?
            </DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500'>
            Optionally tell the applicant why so they can address it.
          </p>
          <Textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder='Reason (optional)'
            rows={3}
          />
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setRejecting(null)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={reject}
              disabled={busyId !== null}
              className='bg-red-600 hover:bg-red-700 text-white cursor-pointer'
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className='flex items-start gap-2'>
      {icon && <span className='text-gray-400 mt-0.5 shrink-0'>{icon}</span>}
      <div className='min-w-0'>
        <p className='text-xs text-gray-400 uppercase'>{label}</p>
        <p className='text-sm text-gray-800 wrap-break-words'>{value}</p>
      </div>
    </div>
  )
}

function ChipList({
  label,
  items,
  tone,
}: {
  label: string
  items: string[]
  tone: 'pink' | 'purple'
}) {
  const cls =
    tone === 'pink'
      ? 'bg-pink-50 text-pink-700 border-pink-200'
      : 'bg-purple-50 text-purple-700 border-purple-200'
  return (
    <div>
      <p className='text-xs text-gray-500 uppercase mb-1'>{label}</p>
      <div className='flex flex-wrap gap-1.5'>
        {items.map((it, i) => (
          <span
            key={`${it}-${i}`}
            className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
