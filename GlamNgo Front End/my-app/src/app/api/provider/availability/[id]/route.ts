import { NextResponse } from "next/server"
import { db } from "@/lib/db"

type Status = "available" | "unavailable" | "booked" | "past"

interface Segment {
  start: string
  end: string
  status: Status
  reason?: string
}

// ---------- helpers ----------
function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function paint(
  minutes: (Segment | null)[],
  startM: number,
  endM: number,
  cell: Segment
) {
  const s = Math.max(0, startM)
  const e = Math.min(1440, endM)

  for (let i = s; i < e; i++) {
    minutes[i] = cell
  }
}

// ---------- API ----------
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const url = new URL(req.url)
  const dateStr =
    url.searchParams.get("date") ||
    new Date().toISOString().slice(0, 10)

  const providerId = Number(id)

  if (!providerId) {
    return NextResponse.json({ msg: "Bad provider" }, { status: 400 })
  }

  const date = new Date(dateStr + "T00:00:00")
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ msg: "Bad date" }, { status: 400 })
  }

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(24, 0, 0, 0)

  // 1440 minutes = full day
  const minutes: (Segment | null)[] = new Array(1440).fill(null)

  // --------------------------------------------------
  // 🟢 1) DEFAULT: ALL DAY AVAILABLE
  // --------------------------------------------------
  paint(minutes, 0, 1440, {
    start: "",
    end: "",
    status: "available",
  })

  // --------------------------------------------------
  // 🔴 2) TIME OFF (block availability)
  // --------------------------------------------------
  const offs = db().prepare(`
    SELECT start_datetime, end_datetime, reason
    FROM time_offs
    WHERE provider_id = ?
      AND start_datetime < ?
      AND end_datetime > ?
  `).all(providerId, dayEnd.toISOString(), dayStart.toISOString()) as any[]

  for (const o of offs) {
    const start = new Date(o.start_datetime)
    const end = new Date(o.end_datetime)

    const s = (start.getTime() - dayStart.getTime()) / 60000
    const e = (end.getTime() - dayStart.getTime()) / 60000

    if (e <= s) continue

    paint(minutes, s, e, {
      start: "",
      end: "",
      status: "unavailable",
      reason: o.reason || "time-off",
    })
  }

  // --------------------------------------------------
  // 🔵 3) BOOKINGS (block slots)
  // --------------------------------------------------
  const bks = db().prepare(`
    SELECT start_datetime, end_datetime
    FROM bookings
    WHERE provider_id = ?
      AND start_datetime < ?
      AND end_datetime > ?
      AND status IN ('PENDING','CONFIRMED')
  `).all(providerId, dayEnd.toISOString(), dayStart.toISOString()) as any[]

  for (const b of bks) {
    const start = new Date(b.start_datetime)
    const end = new Date(b.end_datetime)

    const s = (start.getTime() - dayStart.getTime()) / 60000
    const e = (end.getTime() - dayStart.getTime()) / 60000

    if (e <= s) continue

    paint(minutes, s, e, {
      start: "",
      end: "",
      status: "booked",
    })
  }

  // --------------------------------------------------
  // ⏳ 4) PAST TIME (only for today)
  // --------------------------------------------------
  const now = new Date()
  const isToday = now.toDateString() === date.toDateString()

  if (isToday) {
    const nowMin = now.getHours() * 60 + now.getMinutes()

    if (nowMin > 0) {
      paint(minutes, 0, nowMin, {
        start: "",
        end: "",
        status: "past",
      })
    }
  }

  // --------------------------------------------------
  // 📦 5) COLLAPSE MINUTES → SEGMENTS
  // --------------------------------------------------
  const segments: Segment[] = []

  let i = 0
  while (i < 1440) {
    const cur = minutes[i]!
    let j = i + 1

    while (
      j < 1440 &&
      minutes[j]!.status === cur.status &&
      minutes[j]!.reason === cur.reason
    ) {
      j++
    }

    segments.push({
      start: toHHMM(i),
      end: j === 1440 ? "24:00" : toHHMM(j),
      status: cur.status,
      reason: cur.reason,
    })

    i = j
  }

  // --------------------------------------------------
  // 📊 response meta
  // --------------------------------------------------
  const hasAvailable = segments.some(s => s.status === "available")

  return NextResponse.json({
    date: dateStr,
    dayOfWeek: date.getDay(),
    isToday,
    hasAvailable,
    segments,
  })
}