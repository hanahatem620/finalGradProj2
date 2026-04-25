'use client'
import { Button } from "@/components/ui/button";
import { LuSparkles } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa";
import { LuCreditCard } from "react-icons/lu";
import { PiMagicWand } from "react-icons/pi";
import { MdOutlineShield } from "react-icons/md";
import { LuClock4 } from "react-icons/lu";
import GetStart from "../_components/GetStart/getStart";
import HomeFooter from "../_components/HomeFooter/homeFooter";
import ServiceBookingBtn from "../_components/ServiceBookingBtn/serviceBookingBtn";
import Link from "next/link";




export default function BookServiceTemp() {
  return (
    <>
    
      <div className="bg-linear-to-b from-pink-50 to-purple-50 py-10">
    
                <div className="flex flex-col items-center gap-3">
                    <p className="bg-linear-to-b from-pink-400 to-pink-500 text-white text-sm font-semibold w-fit p-2 rounded-full flex items-center gap-1">
                    <LuSparkles />
                    FOR CLIENTS</p>
    
                    <h1 className="font-bold text-5xl">Book a Service</h1>
                    <p className="text-gray-500 max-w-lg text-center">
                        Get pampered by our professional makeup and hair artists. 
                        Perfect for weddings, events, or everyday glam.</p>
    
                         <div className="flex gap-10">
                            <div className="flex-1">
                                <ServiceBookingBtn title="Find Your Artist" />
                            </div>
                    <Link href={'/LogIn'} className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full py-1 px-5 text-white font-semibold">Join as Client</Link>
                </div>
                </div>
    
            </div>
    
            <div className="bg-white py-5">
                <div className="container lg:w-full w-[90%] mx-auto">
    
                  <div className="text-center mb-5">
                        <h1 className="font-bold text-2xl mb-2">How it Works</h1>
                        <p className="text-gray-500">Finding and booking your perfect beauty artist is simple and secure</p>
                    </div>
        
                        <div className="howCards flex flex-wrap justify-center">
    
                            <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
    
                            <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-2 rounded-full ">
                            <IoSearch  className="text-white text-2xl "/>
                            </div>
    
                            <h3 className="font-bold">Browse Artists</h3>
    
                            <p className="text-gray-600 max-w-60">Browse verified artists in your area with detailed profiles and portfolios</p>
    
                            </div>
    
                            <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
    
                            <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-2 rounded-full ">
                            <FaRegStar  className="text-white text-2xl "/>
                            </div>
    
                            <h3 className="font-bold">Compare & Review</h3>
    
                            <p className="text-gray-600 max-w-55">
                                Compare prices and reviews from real clients to find your perfect match</p>
    
                            </div>
    
                            <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
    
                            <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-2 rounded-full ">
                            <LuCreditCard  className="text-white text-2xl "/>
                            </div>
    
                            <h3 className="font-bold">Book Securely</h3>
    
                            <p className="text-gray-600 max-w-60">
                                Book instantly with secure payment and get instant confirmation</p>
                            </div>
    
                            <div className="flex flex-col items-center p-3 w-xs text-center gap-1">
    
                            <div className="bg-linear-to-b from-pink-400 to-pink-500 w-fit p-2 rounded-full ">
                            <PiMagicWand  className="text-white text-2xl "/>
                            </div>
    
                            <h3 className="font-bold">Get Glam</h3>
    
                            <p className="text-gray-600 max-w-45">
                                Enjoy your professional beauty service and look amazing</p>
                            </div>
    
    
                        </div>
                        
                        
                </div>
            </div>
    
            <div className="bg-purple-50 py-5">
                <div className="container w-[80%] mx-auto">
    
                    <div className="text-center mb-5">
                        <h1 className="font-bold text-3xl">Why Choose GlamNgo</h1>
                    </div>
    
                    <div className="flex flex-wrap justify-center gap-5">
    
                        <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-pink-100 w-fit p-2 rounded-full">
                                <MdOutlineShield className="text-pink-500 text-2xl"/>
                            </div>
    
                            <h2 className="font-bold">Verified Professionals</h2>
                            <p className="text-gray-600 max-w-55">All artists are verified and background-checked to ensure quality and safety</p>
    
                        </div>
    
                         <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-pink-100 w-fit p-2 rounded-full">
                                <PiMagicWand className="text-pink-500 text-2xl"/>
                            </div>
    
                            <h2 className="font-bold">AI Makeup Preview</h2>
                            <p className="text-gray-600 max-w-55">
                            Try our AI makeup preview feature to see how different looks will appear on you</p>
    
                        </div>
    
                         <div className="bg-white w-xs p-5 shadow rounded-xl flex flex-col gap-3">
                            <div className="bg-pink-100 w-fit p-2 rounded-full">
                                <LuClock4 className="text-pink-500 text-2xl"/>
                            </div>
    
                            <h2 className="font-bold">Instant Booking</h2>
                            <p className="text-gray-600 max-w-55">
                              Book services instantly with real-time availability and immediate confirmation</p>
    
                        </div>
    
    
                    </div>
    
                </div>
            </div>
    
            <GetStart/>
            <HomeFooter/>
    
    
    
    </>
  )
}
