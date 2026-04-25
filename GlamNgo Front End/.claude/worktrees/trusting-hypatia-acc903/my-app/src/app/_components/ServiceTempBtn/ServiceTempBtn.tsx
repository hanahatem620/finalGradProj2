import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ServiceTempBtn({ title } : {title :string}) {

    const router = useRouter()
    
    const serviceTemp = () =>{
    router.push('/BookServiceTemp')
}

  return (
    <>
     <Button onClick={serviceTemp} className="rounded-full w-full bg-linear-to-b from-pink-400 to-pink-500 cursor-pointer">
       {title}
      </Button>
    </>
  )
}
