'use client'
import { Button } from "@/components/ui/button";
import { FiBriefcase } from "react-icons/fi";
import { PiMagicWand } from "react-icons/pi";
import { BiDollar } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa6";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { MdOutlineShield } from "react-icons/md";
import { LuClock4 } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { FiAward } from "react-icons/fi";
import { LuChartColumn } from "react-icons/lu";
import ArtistFormBtn from "../_components/ArtistFormBtn/ArtistFormBtn";
import Link from "next/link";









export default function BecomeAPro() {
  return (
    <>
    <div className="bg-linear-to-t from-pink-50 to-purple-50 py-14">
            <div className="container w-[80%] mx-auto">
    
                <div className="flex flex-col items-center gap-3 ">
                    <p className="bg-linear-to-b from-purple-400 to-pink-500 text-white font-semibold text-sm w-fit p-2 rounded-full flex items-center gap-1">
                    <FiBriefcase />

                    FOR ARTISTS</p>
    
                    <div className="w-full text-center">
                        <h1 className="font-bold text-5xl">Join as an Artist</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Grow your beauty business with Glam Myfi.
                         Connect with clients and manage bookings effortlessly.</p>
                    </div>

                    {/* <Button className="rounded-full bg-linear-to-b from-purple-400 to-pink-500">Become an Artist</Button> */}
                    
                    {/* <Button>
                        <Link href={"/artistApp"}>Become an Artist</Link>
                    </Button> */}

                    <div className="w-fit">
                        <ArtistFormBtn title='Become an Artist' />
                    </div>

                </div>
    
            </div>
    
    </div>
       
     <div className="bg-white py-7">
                    <div className="container mx-auto">
        
                      <div className="text-center mb-5">
                            <h1 className="font-bold text-2xl mb-2">How it Works</h1>
                            <p className="text-gray-500">Start growing your beauty business in just a few simple steps</p>
                        </div>
            
                            <div className="pro flex flex-wrap justify-center">
        
                                <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
        
                                <div className="bg-linear-to-t from-pink-500 to-purple-500 w-fit p-2 rounded-full ">
                                <FiBriefcase  className="text-white text-2xl "/>
                                </div>
        
                                <h3 className="font-bold">Create Profile</h3>
        
                                <p className="text-gray-600 max-w-55">Create your professional profile with your portfolio and expertise</p>
        
                                </div>
        
                                <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
        
                                <div className="bg-linear-to-t from-pink-500 to-purple-500 w-fit p-2 rounded-full ">
                                <BiDollar  className="text-white text-2xl "/>
                                </div>
        
                                <h3 className="font-bold">Set Your Rates</h3>
        
                                <p className="text-gray-600 max-w-55">
                                    Set your own prices and schedule based on your availability</p>
        
                                </div>
        
                                <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
        
                                <div className="bg-linear-to-t from-pink-500 to-purple-500 w-fit p-2 rounded-full ">
                                <FaRegBell  className="text-white text-2xl "/>
                                </div>
        
                                <h3 className="font-bold">Get Bookings</h3>
        
                                <p className="text-gray-600 max-w-55">
                                    Receive instant booking notifications from clients in your area</p>
                                </div>
        
                                <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
        
                                <div className="bg-linear-to-t from-pink-500 to-purple-500 w-fit p-2 rounded-full ">
                                <HiMiniArrowTrendingUp  className="text-white text-2xl "/>
                                </div>
        
                                <h3 className="font-bold">Grow Business</h3>
        
                                <p className="text-gray-600 max-w-55">
                                    Build your client base and reputation with reviews and ratings</p>
                                </div>
        
        
                            </div>
                            
                            
                    </div>
    </div>

      <div className="bg-purple-50 py-5">
                <div className="container w-[80%] mx-auto">
    
                    <div className="text-center mb-5">
                        <h1 className="font-bold text-3xl">Why Artists Love GlamNgo</h1>
                    </div>
    
                    <div className="flex flex-wrap justify-center gap-5">
    
                        <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <FiCalendar className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Flexible Schedule</h2>
                            <p className="text-gray-600 max-w-65">
                                Work on your own terms. Set your availability and accept bookings when it suits you</p>
    
                        </div>
    
                         <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <GoPeople className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Build Client Base</h2>
                            <p className="text-gray-600 max-w-55">
                            Connect with new clients and build long-term relationships through our platform
                            </p>
    
                        </div>
    
                         <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <FiAward className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Professional Tools</h2>
                            <p className="text-gray-600 max-w-55">
                              Access professional booking management, payment processing, and analytics tools</p>
    
                        </div>

                        <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <BiDollar className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Secure Payments</h2>
                            <p className="text-gray-600 max-w-55">
                              Get paid securely and on time with our trusted payment system</p>
    
                        </div>

                        <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <LuChartColumn className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Track Performance</h2>
                            <p className="text-gray-600 max-w-55">
                              Monitor your bookings, earnings, and client feedback with detailed analytics</p>
    
                        </div>

                        <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-purple-200 w-fit p-2 rounded-full">
                                <HiMiniArrowTrendingUp className="text-purple-600 text-xl"/>
                            </div>
    
                            <h2 className="font-bold">Grow Your Brand</h2>
                            <p className="text-gray-600 max-w-55">
                              Showcase your portfolio and build your reputation with client reviews</p>
    
                        </div>

                        
    
    
                    </div>
    
                </div>
      </div>

      <div className="bg-white py-10">
            <div className="container w-[80%] mx-auto ">

                <div className="artistCap text-center">
                    <h1 className="font-bold text-3xl">Artist Requirements</h1>
                    <p className="text-gray-500">To join our platform, you'll need to meet these simple requirements</p>
                </div>

                <div className="mt-5 flex justify-center">
                    <div className="bg-white w-3xl p-8 rounded-xl border border-gray-200 shadow">
                        <ul className="list-disc text-purple-400 flex flex-col gap-2">
                        <li>
                        <span className="text-gray-700">Professional certification or proof of training in makeup artistry or hairstyling</span>
                        </li>

                        <li>
                            <span className="text-gray-700">Portfolio showcasing your work (minimum 5 photos)</span>
                        </li>

                        <li>
                            <span className="text-gray-700">Valid business license or proof of self-employment (if applicable)</span>
                        </li>

                        <li>
                            <span className="text-gray-700">Professional liability insurance (recommended)</span>
                        </li>

                        <li>
                            <span className="text-gray-700">Clean background check for client safety</span>
                        </li>
                    </ul>
                    </div>
                </div>


            </div>
      </div>

    <div className="p-8 bg-linear-to-tl from-pink-50 to-purple-50">
        <div className="container w-[90%] mx-auto text-center ">
           <div className="flex flex-col gap-3">
             <h1 className="font-bold text-3xl ">Ready to Grow Your Business?</h1>
            <p className="text-gray-600 ">Join hundreds of successful artists who are building their careers with GlamNgo</p>

                <div className="w-xs mx-auto">
                    <ArtistFormBtn title="Apply to Become an Artist"/>

                </div>

            <p className="text-gray-600">Have questions? <span className="text-pink-500 font-semibold">Contact our support team</span></p>
           </div>
        </div>

       
    </div>
    
    </>
  )
}
