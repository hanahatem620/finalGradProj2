'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function ArtistPortolioBtn() {

const router = useRouter()

const portfolio = () =>{
    router.push('/artistPortfolio')
}



  return (
    <>
    <Button onClick={portfolio} className="bg-linear-to-b from-pink-400 to-pink-500 text-white rounded-full cursor-pointer">Book Now</Button>
    </>
  )
}
