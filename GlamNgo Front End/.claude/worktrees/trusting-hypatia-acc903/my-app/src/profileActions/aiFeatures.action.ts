'use server'

import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';

export async function TryOn(file: File, look_id: string) {



  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")

  const res = await fetch('http://localhost:8080/api/apply-makeup-look', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: `data:image/png;base64,${base64}`,
      look_id,
    }),
  })

  const data = await res.json()

  return data.image
}