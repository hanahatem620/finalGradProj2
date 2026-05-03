'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Booking } from '@/types/adminBookingReceipt.type'

// interface Item {
//   id: number
//   item_name: string | null
//   item_type: string | null
//   price_at_booking: number
//   addons_summary: string | null
// }
// interface Txn { id: number; method: string; amount: number; status: string }

// interface Booking {
//   id: number
//   client_email: string
//   client_name: string | null
//   provider_email: string
//   provider_name: string | null
//   start_datetime: string
//   end_datetime: string
//   status: string
//   total_price: number
//   created_at: string
//   items: Item[]
//   transactions: Txn[]
// }

function fmtDT(s: string) {
  try {
    return new Date(s).toLocaleString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return s }
}
function mins(s: string, e: string) {
  return Math.round((new Date(e).getTime() - new Date(s).getTime()) / 60000)
}

export default function Receipt() {
  const { id } = useParams<{ id: string }>()
  const [b, setB] = useState<Booking | null>(null)

  useEffect(() => {
    fetch(`/api/admin/bookings/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setB)
  }, [id])

  if (!b) return <div className='p-12 text-center text-gray-500'>Loading receipt…</div>

  const itemsSum = b.items.reduce((s, it) => s + (it.price_at_booking || 0), 0)
  const total = b.total_price
  const discount = itemsSum > total ? Math.max(0, itemsSum - total) : 0
  const txn = b.transactions[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');
        body { background:#e9eaec; }
        .receipt-wrap {
          min-height:100vh; display:flex; flex-direction:column; align-items:center;
          padding:40px 10px; font-family:'Share Tech Mono','Courier New',monospace; color:#111;
        }
        .actions { margin-bottom:18px; display:flex; gap:10px; }
        .actions button, .actions a {
          background:#111; color:#fff; border:0; padding:8px 18px; font-family:inherit;
          cursor:pointer; text-decoration:none; font-size:13px; letter-spacing:.5px;
          border-radius:4px;
        }
        .actions a.secondary { background:#666; }
        .receipt {
          background:#fff; width:340px; padding:26px 24px 18px;
          font-size:13px; line-height:1.5; box-shadow:0 4px 16px rgba(0,0,0,.12);
          position:relative;
        }
        .receipt::before, .receipt::after {
          content:""; position:absolute; left:0; right:0; height:10px;
          background:
            linear-gradient(-45deg, transparent 33%, #fff 33%, #fff 66%, transparent 66%) 0 0 / 14px 14px,
            linear-gradient( 45deg, transparent 33%, #fff 33%, #fff 66%, transparent 66%) 0 0 / 14px 14px;
        }
        .receipt::before { top:-10px; }
        .receipt::after  { bottom:-10px; transform:scaleY(-1); }
        .r-head { text-align:center; margin-bottom:8px; }
        .r-head h1 { font-family:'VT323',monospace; font-size:34px; margin:0; letter-spacing:2px; font-weight:normal; }
        .r-head .tag { font-size:11px; color:#555; letter-spacing:1px; }
        .r-head .addr { font-size:11px; color:#555; margin-top:4px; line-height:1.3; }
        .sep { border:0; border-top:1px dashed #333; margin:10px 0; }
        .row { display:flex; justify-content:space-between; gap:8px; }
        .row .label { color:#555; }
        .meta, .items, .totals { font-size:12px; }
        .meta .row { margin:2px 0; }
        .items .item { display:flex; justify-content:space-between; gap:8px; margin:5px 0; align-items:flex-start; }
        .items .name { flex:1; padding-right:6px; }
        .items .name .sub { color:#777; font-size:10px; display:block; }
        .items .price { white-space:nowrap; }
        .totals .row { margin:3px 0; }
        .totals .grand { font-size:16px; font-weight:bold; margin-top:6px; padding-top:6px; border-top:1px dashed #333; }
        .pay-method { text-align:center; font-size:11px; margin-top:8px; padding:6px; background:#f6f6f6; }
        .footer { text-align:center; font-size:11px; color:#555; margin-top:10px; line-height:1.6; }
        .footer .stars { letter-spacing:4px; margin-top:6px; }
        .barcode-bars { display:flex; justify-content:center; gap:1px; margin:6px 0 2px; height:36px; }
        .barcode-bars span { display:inline-block; background:#111; width:2px; height:100%; }
        .barcode-bars span.thin { width:1px; }
        .barcode-bars span.thick { width:3px; }
        .barcode-bars span.gap { background:transparent; width:2px; }
        .stamp { text-align:center; margin-top:12px; border:2px solid #c0392b; color:#c0392b; padding:4px;
                 font-weight:bold; letter-spacing:3px; font-size:14px; transform:rotate(-3deg); opacity:.85; }
        .stamp.ok { border-color:#2a9458; color:#2a9458; }
        .stamp.warn { border-color:#b7860b; color:#b7860b; }
        @media print {
          body { background:#fff; }
          .receipt-wrap { padding:0; }
          .actions { display:none; }
          .receipt { box-shadow:none; }
        }
      `}</style>
      
      <div className='container lg:w-[80%] w-[90%] mx-auto py-10'>
        <div className='receipt-wrap'>
        <div className='actions'>
          <button onClick={() => window.print()}>🖨 Print</button>
          <a className='secondary' href='javascript:window.close()'>Close</a>
        </div>

        <div className='receipt'>
          <div className='r-head'>
            <h1>GlamNGo</h1>
            <div className='tag'>BEAUTY &amp; HAIR STUDIO</div>
            <div className='addr'>Cairo, Egypt<br/>hello@glamngo.com · +20 100 000 0000</div>
          </div>

          <hr className='sep' />

          <div className='meta'>
            <div className='row'><span className='label'>Receipt #</span><span>{b.id.toString().padStart(6, '0')}</span></div>
            <div className='row'><span className='label'>Date</span><span>{fmtDT(b.created_at)}</span></div>
            <div className='row'><span className='label'>Client</span><span>{(b.client_name || b.client_email.split('@')[0]).slice(0, 22)}</span></div>
            <div className='row'><span className='label'>Provider</span><span>{(b.provider_name || b.provider_email.split('@')[0]).slice(0, 22)}</span></div>
            <div className='row'><span className='label'>Appointment</span><span>{fmtDT(b.start_datetime)}</span></div>
            <div className='row'><span className='label'>Duration</span><span>{mins(b.start_datetime, b.end_datetime)} min</span></div>
          </div>

          <hr className='sep' />

          <div className='items'>
            {b.items.length === 0 ? (
              <div className='item'>
                <div className='name'>Service</div>
                <div className='price'>EGP {total.toFixed(2)}</div>
              </div>
            ) : b.items.map(it => (
              <div key={it.id} className='item'>
                <div className='name'>
                  {it.item_name || 'Service'}
                  {it.item_type && <span className='sub'>{it.item_type}</span>}
                  {it.addons_summary && <span className='sub'>+ {it.addons_summary}</span>}
                </div>
                <div className='price'>EGP {(it.price_at_booking || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <hr className='sep' />

          <div className='totals'>
            <div className='row'>
              <span className='label'>Subtotal</span>
              <span>EGP {(itemsSum > 0 ? itemsSum : total).toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className='row'>
                <span className='label'>Discount</span>
                <span>– EGP {discount.toFixed(2)}</span>
              </div>
            )}
            <div className='row grand'>
              <span>TOTAL</span>
              <span>EGP {total.toFixed(2)}</span>
            </div>
          </div>

          <div className='pay-method'>
            {txn ? `PAID via ${txn.method.toUpperCase()} · ${txn.status}` : 'PAYMENT: PENDING'}
          </div>

          {b.status === 'COMPLETED' && <div className='stamp ok'>✓ COMPLETED</div>}
          {b.status === 'CANCELLED' && <div className='stamp'>✕ CANCELLED</div>}
          {b.status === 'CONFIRMED' && <div className='stamp warn'>CONFIRMED</div>}

          <div className='barcode-bars'>
            {Array.from({ length: 32 }).map((_, i) => {
              const cls = ['','thin','thick','gap'][i % 4]
              return <span key={i} className={cls} />
            })}
          </div>
          <div className='text-center text-[10px] tracking-[3px] text-[#333]'>
            *GLMNGO{b.id.toString().padStart(6, '0')}*
          </div>

          <hr className='sep' />

          <div className='footer'>
            Thank you for choosing GlamNGo!<br/>
            Please keep this receipt for your records.
            <div className='stars'>✦ ✦ ✦</div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
