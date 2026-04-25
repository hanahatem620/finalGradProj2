'use client'
import {
  Command,
  CommandInput,
} from "@/components/ui/command"
import { LuSparkles } from "react-icons/lu";
import { HiOutlineShare } from "react-icons/hi";
import Link from 'next/link';
import { LuPalette } from "react-icons/lu";
import { PiShareNetworkBold } from "react-icons/pi";
import AiBtn from "../AIBtn/AiBtn";



export default function HeaderSearch() {
  return (
    <>

       <div className="py-18 bg-linear-to-r from-pink-100 to-purple-100">
          <div className="head text-center flex justify-center flex-col">

        <h1 className='text-4xl font-bold'>Beauty Delivered to You</h1>
        <p className='text-gray-600 max-w-145 mx-auto mt-3'>Book top-rated hair & makeup artists near you for weddings, events, or just because you deserve it.</p>

        <Command className="max-w-sm mx-auto rounded-lg border border-pink-200 mt-3">
      <CommandInput placeholder="Search for artists, services, or locations..." />
      </Command>
        </div>
       </div>

   <div className="bg-white p-1">
     <div className="container w-full mx-auto">

        <div className="features container w-[90%] mx-auto p-8 bg-linear-to-r from-pink-50 to-purple-50 border border-pink-200 mt-10 rounded-4xl flex flex-col lg:flex-row items-center gap-12">

  <div className="left w-full lg:w-1/2">

    <p className="flex items-center gap-2 font-bold text-white bg-linear-to-b from-pink-400 to-purple-500 rounded-full w-fit px-3 py-1 text-sm">
      <LuSparkles />
      NEW FEATURE
    </p>

    <h1 className="font-bold text-3xl mt-4">
      AI MAKEUP Try-On
    </h1>

    <h2 className="text-pink-500 font-bold text-lg">
      (Preview Feature)
    </h2>

    <p className="max-w-sm text-gray-500 mt-4 leading-relaxed">
      Experience the future of beauty!
      Try different makeup looks instantly with
      our AI-powered virtual try-on
      technology before booking your artist.
    </p>


    <div className="icons mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

      <div className="flex gap-3">
       <div className="bg-pink-100 p-3 rounded-full">
          <i className="fa-regular fa-camera text-pink-500 mt-1"></i>
        </div>
        <div>
          <span className="font-medium">Upload or Capture</span>
          <p className="text-gray-400 text-sm">Real-time camera filter</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="bg-pink-100 p-3 rounded-full">
        <LuPalette className="text-pink-500 mt-1 text-xl "/>
        </div>
        <div>
          <span className="font-medium">AI Skin Tone Analyzer</span>
          <p className="text-gray-400 text-sm">Perfect color matching</p>
        </div>
      </div>

      <div className="flex gap-3">
       <div className="bg-pink-100 p-3 rounded-full ">
          <i className="fa-regular fa-star text-pink-500 mt-1"></i>
        </div>
        <div>
          <span className="font-medium">Artist Recommended</span>
          <p className="text-gray-400 text-sm">Curated makeup looks</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="bg-pink-100 p-3 rounded-full ">
          <PiShareNetworkBold className="text-pink-500 mt-1 text-xl"/>
        </div>
        <div>
          <span className="font-medium">Save & Share</span>
          <p className="text-gray-400 text-sm">Preview before booking</p>
        </div>
      </div>

    </div>

   <div className="mt-5">
    <AiBtn/>
   </div>

  </div>

<div className="right w-full lg:w-1/2 hidden aspect-square lg:block bg-linear-to-t from-purple-100 to-pink-100 rounded-[32px] shadow-2xl p-8">
  
    <div className="bg-white rounded-2xl p-6 h-full shadow-xl">
      
      <div className="bg-linear-to-tl from-purple-100 to-pink-100 rounded-2xl h-full flex items-center justify-center">
        <LuSparkles className="text-pink-500 text-9xl" />
      </div>

    </div>


</div>

</div>

    </div>
    
   </div>
    
    </>
  )
}
