'use client'
import ArtistApp from '@/app/artistApp/page'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ArtistFormBtn({ title } : {title :string}) {

const router = useRouter()

const handleArtistForm = () =>{
router.push("/artistApp")
}
    
  return (
    <>
    
    <Button onClick={handleArtistForm} className="rounded-full w-full bg-linear-to-b from-purple-400 to-pink-500 cursor-pointer">
        {title}
   </Button> 
    </>
  )
}
