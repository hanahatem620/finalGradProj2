'use server'

import { MakeupConfig } from "@/types/makeupConfig.type";

export async function CustomMakeup(base64: string, config:MakeupConfig) {

  // AI server may be down — convert connection-failed into a friendly
  // error message so the calling component can toast it.
  let res: Response
  try {
    res = await fetch('http://localhost:8080/api/apply-custom-makeup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, config }),
      cache: 'no-store',
    })
  } catch {
    throw new Error('AI server is unreachable. Run `python3 testai/app.py` and try again.')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `AI server error: ${res.status}`)
  }

  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Makeup processing failed')
  }
  return data.image as string // "data:image/png;base64,..."
}