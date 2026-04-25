'use server'

import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';

export async function TryOn(file: File, look_id: string) {



  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")

  // AI server (testai on :8080) may not be running. Return null on any
  // failure so callers can show a friendly error instead of crashing.
  try {
    const res = await fetch('http://localhost:8080/api/apply-makeup-look', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: `data:image/png;base64,${base64}`,
        look_id,
      }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.image
  } catch {
    return null
  }
}