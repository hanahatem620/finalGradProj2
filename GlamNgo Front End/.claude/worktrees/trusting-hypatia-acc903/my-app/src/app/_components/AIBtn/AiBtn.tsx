'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LuSparkles } from "react-icons/lu";


export default function AiBtn() {
 
const router = useRouter()


  return (
    <>
  <Button onClick={()=> router.push('/aiFeatures')} className='cursor-pointer bg-linear-to-b from-pink-500 to-purple-500 rounded-full'>
    <LuSparkles />
    Try AI Makeup Now
  </Button>    
    </>
  )
}
