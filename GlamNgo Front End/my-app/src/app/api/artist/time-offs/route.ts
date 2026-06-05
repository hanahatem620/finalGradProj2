import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"
import { authOptions } from "../../../../../auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  const userId = Number((session?.user as any)?.id)
  const role = ((session?.user as any)?.role || "").toLowerCase()

  // 🛑 only artist & hairdresser
 if (!userId || !["artist", "hairdresser"].includes(role)) {
  return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
}

  const body = await req.json()

  const {
    start_datetime,
    end_datetime,
    reason = "time-off",
  } = body

  // ❌ validation
  if (!start_datetime || !end_datetime) {
    return NextResponse.json(
      { msg: "start_datetime & end_datetime required" },
      { status: 400 }
    )
  }

  const start = new Date(start_datetime)
  const end = new Date(end_datetime)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json(
      { msg: "Invalid date format" },
      { status: 400 }
    )
  }

  if (end <= start) {
    return NextResponse.json(
      { msg: "end must be after start" },
      { status: 400 }
    )
  }


//over lap
const overlap = db().prepare(`
  SELECT id FROM time_offs
  WHERE provider_id = ?
  AND NOT (
    end_datetime <= ?
    OR start_datetime >= ?
  )
`).get(
  userId,
  start.toISOString(),
  end.toISOString()
)

if (overlap) {
  return NextResponse.json(
    { msg: "Time off overlaps existing one" },
    { status: 409 }
  )
}



  // 💾 insert time off
  const result = db()
    .prepare(`
      INSERT INTO time_offs (
        provider_id,
        start_datetime,
        end_datetime,
        reason
      )
      VALUES (?, ?, ?, ?)
    `)
    .run(
      userId,
      start.toISOString(),
      end.toISOString(),
      reason
    )

  return NextResponse.json({
    id: result.lastInsertRowid,
    msg: "Time off created successfully",
  })
}