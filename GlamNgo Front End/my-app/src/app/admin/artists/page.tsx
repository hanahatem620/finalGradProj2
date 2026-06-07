'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
// import type { CatalogEntry } from '@/lib/serviceCatalog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuArrowDownToLine,
  LuSettings2,
  LuImport,
} from 'react-icons/lu'
import { Provider } from '@/types/providerService.type'
import { Editable, ServiceDraft, ServiceRow } from '@/types/servicesRow.type'
import { CatalogEntry } from '@/types/catalogEntry.type'



const emptyService: ServiceDraft = {
  type: 'MAKEUP', title: '', description: '', duration: 60, base_price: 0,
}



const empty: Editable = {
  name: '', email: '', phone: '', role: 'ARTIST', bio: '', location: '',
}



const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  }),
}

export default function AdminArtists() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Provider | null>(null)
  const [draft, setDraft] = useState<Editable>(empty)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<
    | { kind: 'demote'; provider: Provider }
    | { kind: 'remove'; provider: Provider }
    | null
  >(null)

  // Service management state
  const [svcProvider, setSvcProvider] = useState<Provider | null>(null)
  const [svcRows, setSvcRows] = useState<ServiceRow[]>([])
  const [svcLoading, setSvcLoading] = useState(false)
  const [svcEditingId, setSvcEditingId] = useState<number | 'new' | null>(null)
  const [svcDraft, setSvcDraft] = useState<ServiceDraft>(emptyService)

  // Import flow
  const [importOpen, setImportOpen] = useState(false)
  const [importMode, setImportMode] = useState<'catalog' | 'artist'>('catalog')
  const [importMultiplier, setImportMultiplier] = useState<number>(1)

  // Artist-source state
  const [importSourceId, setImportSourceId] = useState<string>('')
  const [importSourceServices, setImportSourceServices] = useState<ServiceRow[]>([])
  const [importSourceLoading, setImportSourceLoading] = useState(false)
  const [importPicked, setImportPicked] = useState<Set<number>>(new Set())

  // Catalog-source state
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [catalogPicked, setCatalogPicked] = useState<Set<string>>(new Set())
  const [catalogOverrides, setCatalogOverrides] = useState<Record<string, number>>({})

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/providers', { cache: 'no-store' })
      if (!r.ok) {
        toast.error('Failed to load providers')
        return
      }
      const data = await r.json()
      setProviders(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => providers.filter(p => {
    if (!q) return true
    const t = q.toLowerCase()
    return (
      p.name.toLowerCase().includes(t) ||
      p.email.toLowerCase().includes(t) ||
      (p.location || '').toLowerCase().includes(t)
    )
  }), [providers, q])

  function openAdd() {
    setDraft(empty)
    setCreating(true)
  }

  function openEdit(p: Provider) {
    setEditing(p)
    setDraft({
      name: p.name || '',
      email: p.email || '',
      phone: p.phone || '',
      role: p.role.toUpperCase(),
      bio: p.bio || '',
      location: p.location || '',
    })
  }

  async function saveAdd() {
    if (busy) return
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    setBusy(true)
    try {
      const r = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to add artist')
        return
      }
      toast.success(`Added ${draft.name}`)
      setCreating(false)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function saveEdit() {
    if (!editing || busy) return
    setBusy(true)
    try {
      const r = await fetch(`/api/providers/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name.trim(),
          email: draft.email.trim(),
          phone: draft.phone.trim() || null,
          role: draft.role,
          bio: draft.bio.trim() || null,
          location: draft.location.trim() || null,
        }),
      })
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to save')
        return
      }
      toast.success('Saved')
      setEditing(null)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function demote(p: Provider) {
    if (busy) return
    setBusy(true)
    try {
      const r = await fetch(`/api/providers/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'CLIENT' }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({} as any))
        toast.error(data?.msg || 'Failed to demote')
        return
      }
      toast.success(`${p.name} moved back to client`)
      setConfirm(null)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: Provider) {
    if (busy) return
    setBusy(true)
    try {
      const r = await fetch(`/api/providers/${p.id}`, { method: 'DELETE' })
      if (!r.ok) {
        const data = await r.json().catch(() => ({} as any))
        toast.error(data?.msg || 'Failed to remove')
        return
      }
      toast.success(`${p.name} suspended`)
      setConfirm(null)
      await load()
    } finally {
      setBusy(false)
    }
  }

  // ── Services CRUD ────────────────────────────────────────────────────────
  async function openServices(p: Provider) {
    setSvcProvider(p)
    setSvcEditingId(null)
    setSvcDraft(emptyService)
    setSvcLoading(true)
    setSvcRows([])
    try {
      const r = await fetch(`/api/providers/${p.id}/services`, { cache: 'no-store' })
      if (!r.ok) {
        toast.error('Failed to load services')
        return
      }
      const data = await r.json()
      setSvcRows(Array.isArray(data) ? data : [])
    } finally {
      setSvcLoading(false)
    }
  }

  function startSvcEdit(row: ServiceRow) {
    setSvcEditingId(row.id)
    setSvcDraft({
      type: row.type,
      title: row.title,
      description: row.description || '',
      duration: row.duration,
      base_price: row.base_price,
    })
  }

  function startSvcAdd() {
    setSvcEditingId('new')
    setSvcDraft(emptyService)
  }

  function cancelSvcEdit() {
    setSvcEditingId(null)
    setSvcDraft(emptyService)
  }

  function validateDraft(d: ServiceDraft): string | null {
    if (!d.title.trim()) return 'Title is required'
    if (d.type !== 'MAKEUP' && d.type !== 'HAIR') return 'Type must be MAKEUP or HAIR'
    if (!Number.isFinite(d.duration) || d.duration <= 0) return 'Duration must be > 0'
    if (!Number.isFinite(d.base_price) || d.base_price < 0) return 'Price must be ≥ 0'
    return null
  }

  async function saveSvc() {
    if (!svcProvider || busy) return
    const err = validateDraft(svcDraft)
    if (err) { toast.error(err); return }
    setBusy(true)
    try {
      const isNew = svcEditingId === 'new'
      const url = isNew
        ? `/api/providers/${svcProvider.id}/services`
        : `/api/providers/${svcProvider.id}/services/${svcEditingId}`
      const r = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: svcDraft.title.trim(),
          type: svcDraft.type,
          description: svcDraft.description.trim() || null,
          duration: Number(svcDraft.duration),
          base_price: Number(svcDraft.base_price),
        }),
      })
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to save service')
        return
      }
      toast.success(isNew ? 'Service added' : 'Service updated')
      // Re-pull services and refresh card list (artist card shows pills)
      const r2 = await fetch(`/api/providers/${svcProvider.id}/services`, { cache: 'no-store' })
      if (r2.ok) setSvcRows(await r2.json())
      setSvcEditingId(null)
      setSvcDraft(emptyService)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function openImport() {
    setImportOpen(true)
    setImportMode('catalog')
    setImportSourceId('')
    setImportMultiplier(1)
    setImportPicked(new Set())
    setImportSourceServices([])
    setCatalogOverrides({})
    // Load catalog
    let cat: CatalogEntry[] = catalog
    if (cat.length === 0) {
      try {
        const r = await fetch('/api/service-catalog', { cache: 'no-store' })
        if (r.ok) {
          cat = await r.json()
          setCatalog(Array.isArray(cat) ? cat : [])
        } else {
          toast.error('Failed to load catalog')
          return
        }
      } catch {
        toast.error('Failed to load catalog')
        return
      }
    }
    // Pre-check catalog entries that match services already on the target.
    // Unchecking them in the UI will request a removal on submit.
    const onTarget = new Set(svcRows.map(s => s.title.toLowerCase()))
    setCatalogPicked(new Set(
      cat
        .filter(e => onTarget.has(e.title.toLowerCase()))
        .map(e => e.key),
    ))
  }

  async function pickImportSource(sourceIdStr: string) {
    setImportSourceId(sourceIdStr)
    setImportPicked(new Set())
    setImportSourceServices([])
    const sid = Number(sourceIdStr)
    if (!sid) return
    setImportSourceLoading(true)
    try {
      const r = await fetch(`/api/providers/${sid}/services`, { cache: 'no-store' })
      if (!r.ok) { toast.error('Failed to load source services'); return }
      const data: ServiceRow[] = await r.json()
      setImportSourceServices(Array.isArray(data) ? data : [])
      // Pre-check source services that match what's already on the target.
      // Unchecking will queue a removal on submit.
      const onTarget = new Set(svcRows.map(s => s.title.toLowerCase()))
      setImportPicked(new Set(
        (data || [])
          .filter(s => onTarget.has((s.title || '').toLowerCase()))
          .map(s => s.id),
      ))
    } finally {
      setImportSourceLoading(false)
    }
  }

  function toggleImportPick(id: number) {
    setImportPicked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function toggleCatalogPick(key: string) {
    setCatalogPicked(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }

  function setCatalogOverride(key: string, value: number) {
    setCatalogOverrides(prev => {
      const next = { ...prev }
      if (Number.isFinite(value) && value >= 0) next[key] = value
      else delete next[key]
      return next
    })
  }

  async function runImport() {
    if (!svcProvider || busy) return
    const mult = Number(importMultiplier)
    if (!Number.isFinite(mult) || mult <= 0) {
      toast.error('Price multiplier must be a positive number')
      return
    }

    // Compute removals: any target service whose title appears in the
    // checklist but whose checkbox is unchecked — i.e. the admin "uncheck-to-
    // remove" gesture.
    const removeIds: number[] = []
    if (importMode === 'catalog') {
      const titleToKey = new Map<string, string>()
      for (const e of catalog) titleToKey.set(e.title.toLowerCase(), e.key)
      for (const t of svcRows) {
        const k = titleToKey.get(t.title.toLowerCase())
        if (k && !catalogPicked.has(k)) removeIds.push(t.id)
      }
    } else {
      const titleToSrcId = new Map<string, number>()
      for (const s of importSourceServices) titleToSrcId.set(s.title.toLowerCase(), s.id)
      for (const t of svcRows) {
        const sid = titleToSrcId.get(t.title.toLowerCase())
        if (sid != null && !importPicked.has(sid)) removeIds.push(t.id)
      }
    }

    // Build request body based on the active source mode.
    const body: any = { price_multiplier: mult }
    if (removeIds.length > 0) body.remove_service_ids = removeIds

    if (importMode === 'catalog') {
      // Only request "adds" for picked entries that aren't already on target.
      const onTargetTitles = new Set(svcRows.map(s => s.title.toLowerCase()))
      const keysToAdd = Array.from(catalogPicked).filter(k => {
        const entry = catalog.find(e => e.key === k)
        return entry && !onTargetTitles.has(entry.title.toLowerCase())
      })
      if (keysToAdd.length === 0 && removeIds.length === 0) {
        toast('No changes to apply', { description: 'Toggle a service to add or remove it.' })
        return
      }
      const overrides: Record<string, number> = {}
      for (const k of keysToAdd) {
        if (k in catalogOverrides) overrides[k] = catalogOverrides[k]
      }
      if (keysToAdd.length > 0) {
        body.catalog_keys = keysToAdd
        if (Object.keys(overrides).length > 0) body.price_overrides = overrides
      }
    } else {
      const srcId = Number(importSourceId)
      if (!srcId) { toast.error('Pick a source artist'); return }
      if (srcId === svcProvider.id) {
        toast.error('Source and target must be different')
        return
      }
      const onTargetTitles = new Set(svcRows.map(s => s.title.toLowerCase()))
      const idsToAdd = Array.from(importPicked).filter(id => {
        const svc = importSourceServices.find(s => s.id === id)
        return svc && !onTargetTitles.has(svc.title.toLowerCase())
      })
      if (idsToAdd.length === 0 && removeIds.length === 0) {
        toast('No changes to apply', { description: 'Toggle a service to add or remove it.' })
        return
      }
      if (idsToAdd.length > 0) {
        body.source_provider_id = srcId
        body.service_ids = idsToAdd
      }
    }

    setBusy(true)
    try {
      const r = await fetch(
        `/api/providers/${svcProvider.id}/services/import`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      )
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Import failed')
        return
      }
      const ins = data?.inserted_count ?? 0
      const skip = data?.skipped_count ?? 0
      const rem = data?.removed_count ?? 0
      const blocked = data?.removal_blocked ?? []
      const parts: string[] = []
      if (ins > 0) parts.push(`added ${ins}`)
      if (rem > 0) parts.push(`removed ${rem}`)
      if (skip > 0) parts.push(`${skip} skipped`)
      toast.success(parts.length ? `Services synced: ${parts.join(', ')}` : 'No changes applied')
      if (blocked.length > 0) {
        toast.warning(
          `Couldn't remove ${blocked.length}: tied to existing bookings`,
          { description: blocked.map((b: any) => b.title).join(', ') },
        )
      }
      setImportOpen(false)
      setImportSourceId('')
      setImportMultiplier(1)
      setImportPicked(new Set())
      setImportSourceServices([])
      setCatalogPicked(new Set())
      setCatalogOverrides({})
      // Refresh services in the dialog + the artist cards
      const r2 = await fetch(`/api/providers/${svcProvider.id}/services`, { cache: 'no-store' })
      if (r2.ok) setSvcRows(await r2.json())
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function deleteSvc(row: ServiceRow) {
    if (!svcProvider || busy) return
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      const r = await fetch(
        `/api/providers/${svcProvider.id}/services/${row.id}`,
        { method: 'DELETE' },
      )
      const data = await r.json().catch(() => ({} as any))
      if (!r.ok) {
        toast.error(data?.msg || 'Failed to delete service')
        return
      }
      toast.success('Service deleted')
      setSvcRows(prev => prev.filter(s => s.id !== row.id))
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='container lg:w-[80%] w-[90%] mx-auto px-4 lg:px-8 py-8 space-y-6'>
      <motion.div
        className='flex items-end justify-between gap-4 flex-wrap'
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Artists</h1>
          <p className='text-gray-500 text-sm mt-1'>
            {providers.length} active provider{providers.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          onClick={openAdd}
          className='bg-linear-to-b from-pink-500 to-pink-600 text-white cursor-pointer'
        >
          <LuPlus className='me-1' /> Add artist
        </Button>
      </motion.div>

      <div className='relative max-w-md'>
        <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder='Search by name, email, or location'
          className='pl-9'
        />
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[0, 1, 2].map(i => (
            <div key={i} className='h-48 bg-white rounded-xl border border-gray-100 animate-pulse' />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className='border border-dashed border-gray-300 rounded-xl p-16 text-center text-gray-500'>
          No artists found. Add one to get started.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              custom={i}
              whileHover={{ y: -3 }}
              className='bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3'
            >
              <div className='flex gap-3 items-center'>
                {p.image_url ? (
                  <img
                    src={`/uploads/${p.image_url}`}
                    alt={p.name}
                    className='w-14 h-14 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-14 h-14 rounded-full bg-linear-to-br from-pink-400 to-pink-500 text-white font-bold flex items-center justify-center text-xl'>
                    {p.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <h3 className='font-bold truncate'>{p.name}</h3>
                    <Badge className={p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className='text-xs text-gray-500 truncate'>{p.email}</p>
                  <p className='text-xs text-pink-500 font-semibold'>
                    {p.role === 'artist' ? 'Makeup Artist' : 'Hair Stylist'}
                  </p>
                </div>
              </div>

              {p.location && (
                <p className='text-xs text-gray-500'>📍 {p.location}</p>
              )}

              {p.bio && (
                <p className='text-xs text-gray-600 line-clamp-2'>{p.bio}</p>
              )}

              <div>
                <p className='text-xs text-gray-400 uppercase mb-1'>Services</p>
                {p.services.length === 0 ? (
                  <p className='text-xs text-gray-400 italic'>None listed</p>
                ) : (
                  <div className='flex flex-wrap gap-1'>
                    {p.services.map(s => (
                      <span
                        key={s.id}
                        className='text-xs px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full border border-pink-200'
                      >
                        {s.title} · EGP {s.base_price}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex flex-wrap gap-2 pt-2 border-t border-gray-100'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => openEdit(p)}
                  className='cursor-pointer flex-1 min-w-fit'
                >
                  <LuPencil className='me-1 w-3.5 h-3.5' /> Edit
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => openServices(p)}
                  className='cursor-pointer border-pink-300 text-pink-600 hover:bg-pink-50 flex-1 min-w-fit'
                  title='Manage services & pricing'
                >
                  <LuSettings2 className='me-1 w-3.5 h-3.5' /> Services
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setConfirm({ kind: 'demote', provider: p })}
                  className='cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-50'
                  title='Move account back to client role'
                >
                  <LuArrowDownToLine className='me-1 w-3.5 h-3.5' /> Demote
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setConfirm({ kind: 'remove', provider: p })}
                  className='cursor-pointer border-red-300 text-red-600 hover:bg-red-50'
                  title='Suspend the account'
                >
                  <LuTrash2 className='w-3.5 h-3.5' />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={creating} onOpenChange={open => !open && setCreating(false)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Add Artist</DialogTitle>
          </DialogHeader>
          <ProviderForm draft={draft} setDraft={setDraft} />
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreating(false)} className='cursor-pointer'>
              Cancel
            </Button>
            <Button
              onClick={saveAdd}
              disabled={busy}
              className='bg-pink-600 hover:bg-pink-700 text-white cursor-pointer'
            >
              {busy ? 'Saving...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Edit {editing?.name}</DialogTitle>
          </DialogHeader>
          <ProviderForm draft={draft} setDraft={setDraft} editing />
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditing(null)} className='cursor-pointer'>
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={busy}
              className='bg-pink-600 hover:bg-pink-700 text-white cursor-pointer'
            >
              {busy ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Services Dialog */}
      <Dialog
        open={svcProvider !== null}
        onOpenChange={open => {
          if (!open) {
            setSvcProvider(null)
            setSvcEditingId(null)
            setSvcDraft(emptyService)
            setSvcRows([])
          }
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              Services{svcProvider ? ` · ${svcProvider.name}` : ''}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-3'>
            {svcLoading ? (
              <div className='py-8 text-center text-sm text-gray-500'>Loading services…</div>
            ) : svcRows.length === 0 && svcEditingId !== 'new' ? (
              <div className='py-8 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-md'>
                No services yet. Add one below to make this artist bookable.
              </div>
            ) : (
              <div className='space-y-2'>
                {svcRows.map(s => (
                  <div
                    key={s.id}
                    className='border border-gray-200 rounded-md p-3'
                  >
                    {svcEditingId === s.id ? (
                      <ServiceForm draft={svcDraft} setDraft={setSvcDraft} />
                    ) : (
                      <div className='flex items-center justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <span className='font-semibold truncate'>{s.title}</span>
                            <Badge className='bg-gray-100 text-gray-700 text-[10px]'>
                              {s.type}
                            </Badge>
                          </div>
                          {s.description && (
                            <p className='text-xs text-gray-500 mt-0.5 line-clamp-2'>
                              {s.description}
                            </p>
                          )}
                          <p className='text-xs text-gray-500 mt-0.5'>
                            {s.duration} min · EGP {s.base_price}
                          </p>
                        </div>
                        <div className='flex gap-1 shrink-0'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => startSvcEdit(s)}
                            className='cursor-pointer'
                          >
                            <LuPencil className='w-3.5 h-3.5' />
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => deleteSvc(s)}
                            disabled={busy}
                            className='cursor-pointer border-red-300 text-red-600 hover:bg-red-50'
                          >
                            <LuTrash2 className='w-3.5 h-3.5' />
                          </Button>
                        </div>
                      </div>
                    )}

                    {svcEditingId === s.id && (
                      <div className='flex justify-end gap-2 mt-3'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={cancelSvcEdit}
                          className='cursor-pointer'
                        >
                          Cancel
                        </Button>
                        <Button
                          size='sm'
                          onClick={saveSvc}
                          disabled={busy}
                          className='bg-pink-600 hover:bg-pink-700 text-white cursor-pointer'
                        >
                          {busy ? 'Saving…' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* New-service row */}
            {svcEditingId === 'new' && (
              <div className='border border-pink-200 bg-pink-50/30 rounded-md p-3'>
                <ServiceForm draft={svcDraft} setDraft={setSvcDraft} />
                <div className='flex justify-end gap-2 mt-3'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={cancelSvcEdit}
                    className='cursor-pointer'
                  >
                    Cancel
                  </Button>
                  <Button
                    size='sm'
                    onClick={saveSvc}
                    disabled={busy}
                    className='bg-pink-600 hover:bg-pink-700 text-white cursor-pointer'
                  >
                    {busy ? 'Adding…' : 'Add service'}
                  </Button>
                </div>
              </div>
            )}

            {svcEditingId === null && !svcLoading && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <Button
                  onClick={startSvcAdd}
                  variant='outline'
                  className='cursor-pointer border-dashed border-pink-300 text-pink-600 hover:bg-pink-50'
                >
                  <LuPlus className='me-1' /> Add a service
                </Button>
                <Button
                  onClick={openImport}
                  variant='outline'
                  className='cursor-pointer border-dashed border-purple-300 text-purple-600 hover:bg-purple-50'
                  title='Import from the standard catalog or copy from another artist'
                >
                  <LuImport className='me-1' /> Import services
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setSvcProvider(null)}
              className='cursor-pointer'
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import services dialog */}
      <Dialog
        open={importOpen}
        onOpenChange={open => {
          if (!open) {
            setImportOpen(false)
            setImportSourceId('')
            setImportMultiplier(1)
            setImportPicked(new Set())
            setImportSourceServices([])
            setCatalogPicked(new Set())
            setCatalogOverrides({})
          }
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Import services</DialogTitle>
          </DialogHeader>

          {/* Source-mode tabs */}
          <div className='flex border-b border-gray-200 -mt-1'>
            <button
              type='button'
              onClick={() => setImportMode('catalog')}
              className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition ${
                importMode === 'catalog'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              From catalog
            </button>
            <button
              type='button'
              onClick={() => setImportMode('artist')}
              className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer transition ${
                importMode === 'artist'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              From another artist
            </button>
          </div>

          <div className='space-y-3'>
            <p className='text-sm text-gray-500'>
              {importMode === 'catalog'
                ? <>Pick from the standard service catalog for <span className='font-semibold'>{svcProvider?.name}</span>. Prices are pre-set but can be overridden per service.</>
                : <>Pick services from another artist for <span className='font-semibold'>{svcProvider?.name}</span>.</>}
              {' '}Already-added services are checked — uncheck to remove them.
            </p>

            {/* CATALOG MODE */}
            {importMode === 'catalog' && (
              <div>
                <div className='flex items-center justify-between mb-1'>
                  <Label className='text-xs'>Services on this artist *</Label>
                  {catalog.length > 0 && (
                    <div className='flex gap-2 text-xs'>
                      <button
                        type='button'
                        onClick={() => setCatalogPicked(new Set(catalog.map(e => e.key)))}
                        className='text-purple-600 hover:underline cursor-pointer'
                      >
                        Select all
                      </button>
                      <span className='text-gray-300'>|</span>
                      <button
                        type='button'
                        onClick={() => setCatalogPicked(new Set())}
                        className='text-gray-500 hover:underline cursor-pointer'
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {catalog.length === 0 ? (
                  <div className='py-6 text-center text-sm text-gray-500 border border-gray-200 rounded-md'>
                    Loading catalog…
                  </div>
                ) : (
                  <div className='max-h-72 overflow-y-auto border border-gray-200 rounded-md divide-y'>
                    {catalog.map(e => {
                      const existsOnTarget = svcRows.some(
                        r => r.title.toLowerCase() === e.title.toLowerCase(),
                      )
                      const on = catalogPicked.has(e.key)
                      const override = catalogOverrides[e.key]
                      // Surface the four states: stay-on, will-add, will-remove, stay-off
                      const willAdd = on && !existsOnTarget
                      const willRemove = !on && existsOnTarget
                      const stateClass = willAdd
                        ? 'bg-purple-50/60'
                        : willRemove
                          ? 'bg-red-50/60'
                          : on
                            ? 'bg-gray-50'
                            : 'hover:bg-gray-50'
                      return (
                        <label
                          key={e.key}
                          htmlFor={`cat-${e.key}`}
                          className={`flex items-start gap-3 p-3 cursor-pointer transition ${stateClass}`}
                        >
                          <Checkbox
                            id={`cat-${e.key}`}
                            checked={on}
                            onCheckedChange={() => toggleCatalogPick(e.key)}
                            className='mt-1'
                          />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <span className='font-semibold truncate'>{e.title}</span>
                              <Badge className='bg-gray-100 text-gray-700 text-[10px]'>
                                {e.type}
                              </Badge>
                              {existsOnTarget && !willRemove && (
                                <Badge className='bg-emerald-100 text-emerald-700 text-[10px]'>
                                  On profile
                                </Badge>
                              )}
                              {willRemove && (
                                <Badge className='bg-red-100 text-red-700 text-[10px]'>
                                  Will be removed
                                </Badge>
                              )}
                              {willAdd && (
                                <Badge className='bg-purple-100 text-purple-700 text-[10px]'>
                                  Will be added
                                </Badge>
                              )}
                            </div>
                            <p className='text-xs text-gray-500 mt-0.5'>
                              {e.duration} min · standard EGP {e.base_price}
                            </p>
                            {willAdd && (
                              <div className='flex items-center gap-2 mt-2'>
                                <Label className='text-[11px] text-gray-500 whitespace-nowrap'>
                                  Override price (EGP):
                                </Label>
                                <Input
                                  type='number'
                                  min={0}
                                  step='0.01'
                                  value={override != null ? override : ''}
                                  placeholder={String(e.base_price)}
                                  onChange={ev => {
                                    const v = ev.target.valueAsNumber
                                    if (Number.isNaN(v)) {
                                      setCatalogOverride(e.key, NaN)
                                    } else {
                                      setCatalogOverride(e.key, v)
                                    }
                                  }}
                                  className='h-7 text-xs w-28'
                                  onClick={ev => ev.preventDefault()}
                                />
                              </div>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
                <p className='text-xs text-gray-400 mt-1'>
                  {catalogPicked.size} on profile after save
                </p>
              </div>
            )}

            {/* ARTIST MODE */}
            {importMode === 'artist' && (
              <>
                <div>
                  <Label className='text-xs mb-1 block'>Source artist *</Label>
                  <select 
                  aria-label='source artist'
                    value={importSourceId}
                    onChange={e => pickImportSource(e.target.value)}
                    className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm'
                  >
                    <option value=''>— Pick an artist —</option>
                    {providers
                      .filter(p =>
                        p.id !== svcProvider?.id &&
                        p.services.length > 0,
                      )
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.services.length} service
                          {p.services.length === 1 ? '' : 's'}
                        </option>
                      ))}
                  </select>
                  {providers.filter(p => p.id !== svcProvider?.id && p.services.length > 0).length === 0 && (
                    <p className='text-xs text-amber-600 mt-1'>
                      No other artists have services yet to import from.
                    </p>
                  )}
                </div>

                {importSourceId && (
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <Label className='text-xs'>Services on this artist *</Label>
                      {importSourceServices.length > 0 && (
                        <div className='flex gap-2 text-xs'>
                          <button
                            type='button'
                            onClick={() =>
                              setImportPicked(new Set(importSourceServices.map(s => s.id)))
                            }
                            className='text-purple-600 hover:underline cursor-pointer'
                          >
                            Select all
                          </button>
                          <span className='text-gray-300'>|</span>
                          <button
                            type='button'
                            onClick={() => setImportPicked(new Set())}
                            className='text-gray-500 hover:underline cursor-pointer'
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>

                    {importSourceLoading ? (
                      <div className='py-6 text-center text-sm text-gray-500 border border-gray-200 rounded-md'>
                        Loading services…
                      </div>
                    ) : importSourceServices.length === 0 ? (
                      <div className='py-6 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-md'>
                        This artist has no services.
                      </div>
                    ) : (
                      <div className='max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y'>
                        {importSourceServices.map(s => {
                          const existsOnTarget = svcRows.some(
                            r => r.title.toLowerCase() === s.title.toLowerCase(),
                          )
                          const on = importPicked.has(s.id)
                          const willAdd = on && !existsOnTarget
                          const willRemove = !on && existsOnTarget
                          const stateClass = willAdd
                            ? 'bg-purple-50/60'
                            : willRemove
                              ? 'bg-red-50/60'
                              : on
                                ? 'bg-gray-50'
                                : 'hover:bg-gray-50'
                          return (
                            <label
                              key={s.id}
                              htmlFor={`imp-${s.id}`}
                              className={`flex items-start gap-3 p-3 cursor-pointer transition ${stateClass}`}
                            >
                              <Checkbox
                                id={`imp-${s.id}`}
                                checked={on}
                                onCheckedChange={() => toggleImportPick(s.id)}
                                className='mt-1'
                              />
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 flex-wrap'>
                                  <span className='font-semibold truncate'>{s.title}</span>
                                  <Badge className='bg-gray-100 text-gray-700 text-[10px]'>
                                    {s.type}
                                  </Badge>
                                  {existsOnTarget && !willRemove && (
                                    <Badge className='bg-emerald-100 text-emerald-700 text-[10px]'>
                                      On profile
                                    </Badge>
                                  )}
                                  {willRemove && (
                                    <Badge className='bg-red-100 text-red-700 text-[10px]'>
                                      Will be removed
                                    </Badge>
                                  )}
                                  {willAdd && (
                                    <Badge className='bg-purple-100 text-purple-700 text-[10px]'>
                                      Will be added
                                    </Badge>
                                  )}
                                </div>
                                <p className='text-xs text-gray-500 mt-0.5'>
                                  {s.duration} min · EGP {s.base_price}
                                </p>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    )}
                    <p className='text-xs text-gray-400 mt-1'>
                      {importPicked.size} on profile after save
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <Label className='text-xs mb-1 block'>
                Price multiplier (applies to all selected) — optional
              </Label>
              <Input
                type='number'
                step='0.05'
                min={0.1}
                value={importMultiplier}
                onChange={e =>
                  setImportMultiplier(e.target.valueAsNumber)
                }
              />
              <p className='text-xs text-gray-400 mt-1'>
                1.0 keeps prices as-is; 1.2 = +20%; 0.9 = −10%.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setImportOpen(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            {(() => {
              // Calculate pending adds and removes for the active mode so the
              // CTA reflects intent and disables when nothing's pending.
              const onTitles = new Set(svcRows.map(r => r.title.toLowerCase()))
              let adds = 0
              let removes = 0
              if (importMode === 'catalog') {
                for (const e of catalog) {
                  const exists = onTitles.has(e.title.toLowerCase())
                  const checked = catalogPicked.has(e.key)
                  if (checked && !exists) adds++
                  if (!checked && exists) removes++
                }
              } else if (importSourceId) {
                for (const s of importSourceServices) {
                  const exists = onTitles.has(s.title.toLowerCase())
                  const checked = importPicked.has(s.id)
                  if (checked && !exists) adds++
                  if (!checked && exists) removes++
                }
              }
              const noChanges = adds === 0 && removes === 0
              const parts: string[] = []
              if (adds > 0) parts.push(`+${adds}`)
              if (removes > 0) parts.push(`−${removes}`)
              const label = busy
                ? 'Saving…'
                : noChanges
                  ? 'No changes'
                  : `Save (${parts.join(' / ')})`
              return (
                <Button
                  onClick={runImport}
                  disabled={
                    busy ||
                    noChanges ||
                    (importMode === 'artist' && !importSourceId)
                  }
                  className='bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                >
                  {label}
                </Button>
              )
            })()}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm demote / remove */}
      <AlertDialog
        open={confirm !== null}
        onOpenChange={open => !open && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === 'demote'
                ? `Demote ${confirm.provider.name} to client?`
                : confirm?.kind === 'remove'
                ? `Suspend ${confirm.provider.name}?`
                : ''}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === 'demote'
                ? "They'll go back to a client role and won't appear in the artist list. They can re-apply any time."
                : confirm?.kind === 'remove'
                ? "Their account will be suspended. They can be reactivated later. Existing bookings and reviews are preserved."
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirm) return
                if (confirm.kind === 'demote') demote(confirm.provider)
                else remove(confirm.provider)
              }}
              className={`cursor-pointer ${
                confirm?.kind === 'remove'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {confirm?.kind === 'demote' ? 'Demote' : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ProviderForm({
  draft,
  setDraft,
  editing,
}: {
  draft: Editable
  setDraft: (d: Editable) => void
  editing?: boolean
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div className='md:col-span-2'>
        <Label className='text-xs mb-1 block'>Full name *</Label>
        <Input
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          placeholder='Layla Hassan'
        />
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Email *</Label>
        <Input
          type='email'
          value={draft.email}
          onChange={e => setDraft({ ...draft, email: e.target.value })}
          placeholder='layla@example.com'
        />
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Phone</Label>
        <Input
          value={draft.phone}
          onChange={e => setDraft({ ...draft, phone: e.target.value })}
          placeholder='+201234567890'
        />
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Role</Label>
        <select
        aria-label='role'
          value={draft.role}
          onChange={e => setDraft({ ...draft, role: e.target.value })}
          className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm'
        >
          <option value='ARTIST'>Makeup Artist</option>
          <option value='HAIRDRESSER'>Hairdresser</option>
        </select>
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Location</Label>
        <Input
          value={draft.location}
          onChange={e => setDraft({ ...draft, location: e.target.value })}
          placeholder='Cairo'
        />
      </div>
      <div className='md:col-span-2'>
        <Label className='text-xs mb-1 block'>Bio</Label>
        <Textarea
          value={draft.bio}
          onChange={e => setDraft({ ...draft, bio: e.target.value })}
          rows={3}
          placeholder='Specialises in soft glam bridal looks...'
        />
      </div>
      {!editing && (
        <p className='md:col-span-2 text-xs text-gray-400'>
          A placeholder password is set — the artist signs in via password reset using their email.
        </p>
      )}
    </div>
  )
}

function ServiceForm({
  draft,
  setDraft,
}: {
  draft: ServiceDraft
  setDraft: (d: ServiceDraft) => void
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div className='md:col-span-2'>
        <Label className='text-xs mb-1 block'>Title *</Label>
        <Input
          value={draft.title}
          onChange={e => setDraft({ ...draft, title: e.target.value })}
          placeholder='e.g. Bridal Makeup'
        />
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Type *</Label>
        <select
          aria-label='service type'
          value={draft.type}
          onChange={e => setDraft({ ...draft, type: e.target.value })}
          className='w-full border border-gray-200 rounded-md px-3 py-2 text-sm'
        >
          <option value='MAKEUP'>Makeup</option>
          <option value='HAIR'>Hair</option>
        </select>
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Duration (min) *</Label>
        <Input
          type='number'
          min={1}
          value={Number.isFinite(draft.duration) ? draft.duration : ''}
          onChange={e =>
            setDraft({ ...draft, duration: e.target.valueAsNumber })
          }
          placeholder='60'
        />
      </div>
      <div>
        <Label className='text-xs mb-1 block'>Base price (EGP) *</Label>
        <Input
          type='number'
          min={0}
          step='0.01'
          value={Number.isFinite(draft.base_price) ? draft.base_price : ''}
          onChange={e =>
            setDraft({ ...draft, base_price: e.target.valueAsNumber })
          }
          placeholder='200'
        />
      </div>
      <div className='md:col-span-2'>
        <Label className='text-xs mb-1 block'>Description</Label>
        <Textarea
          rows={2}
          value={draft.description}
          onChange={e => setDraft({ ...draft, description: e.target.value })}
          placeholder='Optional details shown on the booking page'
        />
      </div>
    </div>
  )
}
