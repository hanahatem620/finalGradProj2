'use client'
import { useEffect, useState } from 'react'
import { AiTryOne } from '@/profileActions/tryOnMakeup.action'
import { TryOn } from '@/profileActions/aiFeatures.action'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { LuSparkles } from "react-icons/lu";
import { FiUpload } from "react-icons/fi";
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Look } from '@/types/look.type'
import MakeupCard from '../_components/CustomMakeupAi/CustomMakeupAi'
import Image from 'next/image'



export default function AiFeatures() {

  const [looks, setLooks] = useState<Look[]>([])
  const [selectedLook, setSelectedLook] = useState<string | null>(null)

  // look state
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
 
// makeup state
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customLoading, setCustomLoading] = useState(false)


  // load looks
  useEffect(() => {
    async function flag() {
      const res = await AiTryOne()
      setLooks(res.looks)
      // console.log('aifaeture res' , res)
    }

    flag()
  }, [])


  // apply makeup
 async function handleApply() {
  if (!file || !selectedLook) {
    toast.error("Please select a look and upload an image", {
      position: 'top-center',
      duration: 2000
    })
    return
  }

  setCustomLoading(true)

  try {
    const image = await TryOn(file, selectedLook)
    setResult(image)
  } catch (err) {
    toast.error("Something went wrong")
    // console.log(err)
  } finally {
    setCustomLoading(false)
  }
}



  return (
    <div className='container w-[90%] mx-auto py-10'>

      <div>
          <h1 className='text-3xl flex items-center justify-center gap-2 font-bold'><LuSparkles className='text-pink-500' /> AI Makeup Try-On</h1>
          <p className='text-center text-pink-500'>preview Feature</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-5 justify-between mt-4'>
        <div className='lg:w-[50%]'>

        <div className='bg-pink-100 p-5 rounded-md'>

          <div className='bg-white p-10 border border-pink-500 rounded-md'>
      <div className="mt-6">
       <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">

        
        <LuSparkles className='text-5xl text-pink-500'/>

        
        <p className="text-lg font-bold">
          Upload Your Photo
        </p>

        
        <p className="text-sm text-gray-500 mt-1 text-center">
          Upload a clear photo of your face for the best AI makeup try-on experience 
        </p>

        
      <div className="mt-3">
        <Input
          type="file"
          className='hidden'
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <p className='flex items-center gap-1 bg-pink-500 p-2 rounded-full text-white font-semibold'>
          <FiUpload className='text-xl'/>
          Upload Photo
        </p>

      </div>

      </label>

      </div>
          </div>

        <p className='text-gray-500 mt-2 text-sm'>Upload photo and choose from our ready-made looks</p>

        </div>

        <Button
        onClick={handleApply}
        disabled={customLoading}
        className="mt-4 bg-linear-to-b from-pink-400 to-pink-500 text-white p-2 rounded-md w-full cursor-pointer"
      >

        {customLoading ? 'Processing...' : 'Apply Makeup'}
      </Button>

       {file && (
        <p className='text-sm text-gray-500'>Selected: {file.name}</p>
        )}

        {result && (
        <div className="mt-6">
          <h2>Result:</h2>
          <img src={result} alt="Ai Makeup Result" width={500} height={500} loading='eager' />
        </div>
      )}

      </div>

      <div className='lg:w-[60%] bg-pink-100 rounded-md  p-3'>
          <div className='text-center mb-2'>
            <h1 className='font-bold'>Choose a MakeUp Look</h1>
            <p className='text-gray-500 font-semibold'>Select from looks recommended by our AI</p>
          </div>

          <div>

        <Tabs defaultValue="custom" >

      <TabsList className='w-full bg-none '>
        <TabsTrigger value="custom">Customize Makeup</TabsTrigger>
        <TabsTrigger value="readyLooks">Ready Looks</TabsTrigger>
      </TabsList>

      <TabsContent value="custom" >
        <Card className='border-0 shadow-none bg-pink-50'>
          <CardHeader>
            <CardTitle className='font-bold text-xl'>Choose the area, color, and intensity:</CardTitle>
           <p className="text-gray-500 text-sm">Upload photo and customize your makeup</p>
          </CardHeader>
          <MakeupCard/>
        </Card>
      </TabsContent>

      <TabsContent value="readyLooks" >
        <Card className='border-0 shadow-none bg-pink-50'>
          <CardHeader>
            <CardTitle className='font-bold text-xl'>Choose a ready look:</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-3 gap-4">
                  {looks?.map((look) => (
                    <div
                      key={look.id}
                      onClick={() => setSelectedLook(look.id)}
                      className={`border border-pink-300 rounded-md p-3 text-center cursor-pointer transition ${
                        selectedLook == look.id ? 'border-pink-500 bg-pink-300 shadow-md' : 'border-pink-300'
                      }`}
                    >
                      <p className="font-bold">{look.name}</p>
                      <p>{look.artist}</p>
          
                      
                    </div>
                  ))}
                </div>
                    </CardContent>
        </Card>
      </TabsContent>
      
    </Tabs>

          </div>
      </div>
      </div>

    </div>
  )
}