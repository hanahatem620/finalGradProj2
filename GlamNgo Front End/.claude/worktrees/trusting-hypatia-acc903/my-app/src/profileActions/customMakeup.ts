'use server'

import { MakeupConfig } from "@/types/makeupConfig.type";

export async function CustomMakeup(base64: string, config:MakeupConfig) {

  const res = await fetch('http://localhost:8080/api/apply-custom-makeup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64,
       config }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `AI server error: ${res.status}`);
  }

  const data = await res.json();
  // console.log(data);
  

  if (!data.success) {
    throw new Error(data.error || 'Makeup processing failed');
  }

  return data.image as string; // "data:image/png;base64,..."
}