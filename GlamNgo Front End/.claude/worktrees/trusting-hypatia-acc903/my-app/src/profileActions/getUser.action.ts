'use server'
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';

export async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.access_token) return null;
  // console.log("session" , session)


  const res = await fetch('http://127.0.0.1:5001/me', {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) return null;

  const payload = await res.json();
  return payload;
}