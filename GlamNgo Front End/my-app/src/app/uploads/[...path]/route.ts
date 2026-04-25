import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Serve /uploads/<subpath> from the shared Grad/uploads/ folder that lives
// alongside the Flask-era uploads — so existing avatar files continue to work.
const UPLOADS_DIR = path.resolve(process.cwd(), '..', '..', 'uploads')

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params
  const relative = parts.join('/')
  // Block traversal: the resolved file must still live under UPLOADS_DIR.
  const filePath = path.resolve(UPLOADS_DIR, relative)
  if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  try {
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
    return new NextResponse(ab, {
      status: 200,
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
