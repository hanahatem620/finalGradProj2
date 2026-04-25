"use server";

export async function resetUserPassword(token: string, password: string) {
  const res = await fetch('http://127.0.0.1:5001/auth/reset-password', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reset_token: token,
      password: password,
    }),
  });
const payload = await res.json()
  if (!res.ok) {
    throw new Error("Failed to reset password");
  }

//  const payload = await res.json()
        
return payload
}