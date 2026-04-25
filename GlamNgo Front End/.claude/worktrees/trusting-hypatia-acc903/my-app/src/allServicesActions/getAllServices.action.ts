'use server'


export async function getAllServices(id: number) {

  const res = await fetch(`http://127.0.0.1:5001/providers/${id}`, {
    method: "GET",
  });

  if (!res.ok) return null;

  const payload = await res.json();
  return payload;
}