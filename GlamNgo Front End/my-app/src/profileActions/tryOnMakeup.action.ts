'use server'

// Guarded fetch: if the AI server (port 8080, started separately via
// `python3 testai/app.py`) isn't running, we DON'T want the server action
// to throw — that surfaces as a "fetch failed AggregateError" on whatever
// page called us, often killing the entire route render. Return a safe
// shape instead and let the UI show an empty state.
export async function AiTryOne() {
  try {
    const res = await fetch('http://localhost:8080/api/makeup-looks', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return { success: false, looks: [], error: `AI server ${res.status}` }
    return await res.json()
  } catch (e: any) {
    return { success: false, looks: [], error: e?.message || 'AI server unreachable' }
  }
}