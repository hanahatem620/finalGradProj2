'use server'
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth';


export async function AiTryOne() {
 

  const res = await fetch('http://localhost:8080/api/makeup-looks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      
    },
    
  });

  const data = await res.json();  
  return data;
}