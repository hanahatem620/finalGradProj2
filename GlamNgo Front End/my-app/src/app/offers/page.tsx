'use client'
import { FiGift } from "react-icons/fi";
import Bundels from "../_components/Bundels/bundels";
import HomeFooter from "../_components/HomeFooter/homeFooter";



export default function Offers() {



  return (
    <>
    
    <div className="bg-linear-to-b from-pink-50 to-purple-50 py-16">
        <div className="container w-[80%] mx-auto">

            <div className="flex flex-col items-center gap-3 ">
                <p className="bg-linear-to-b from-pink-400 to-pink-500 text-white font-semibold text-sm w-fit p-2 rounded-full flex items-center gap-2">
                <FiGift />
                SPECIAL OFFERS</p>

                <h1 className="font-bold text-5xl">Beauty Packages</h1>
                <p className="text-gray-500">Save more with our bundled packages designed for every occasion</p>
            </div>

        </div>

    </div>

        <Bundels/>
   
    <div className="bg-white py-15">

        <div className="text-center mb-5">
                <h1 className="font-bold text-3xl">Why Choose Our Packages?</h1>
             </div>

        <div className="container w-[70%] mx-auto text-center">

             <div className="why flex justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-pink-500">20%</h1>
                    <p className="text-gray-500 max-w-40">Average savings on bundled services</p>
                </div>

                 <div>
                    <h1 className="text-3xl font-bold text-pink-500">100+</h1>
                    <p className="text-gray-500 ">Happy customers monthly</p>
                </div>

                 <div>
                    <h1 className="text-3xl font-bold text-pink-500">4.9
                        <i className="fa-solid fa-star text-xl"></i>
                    </h1>
                    <p className="text-gray-500 ">Average package rating</p>
                </div>


             </div>
        </div>
    </div>
    
    <HomeFooter/>
    
    </>
  )
}
