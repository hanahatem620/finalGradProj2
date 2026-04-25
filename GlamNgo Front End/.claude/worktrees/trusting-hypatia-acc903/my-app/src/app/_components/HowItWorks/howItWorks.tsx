'use client'
import { LuCreditCard } from "react-icons/lu";
import { LuSparkles } from "react-icons/lu";



export default function HowItWorks() {



  return (
    <>
    <div className="py-4 bg-white">

        <div className="container lg:w-[90%] mx-auto md:w-[60%]">

            <div className="flex flex-wrap flex-col md:flex-row items-center lg:items-stretch md:items-stretch gap-7 p-10">

                <div className="howItCard bg-linear-to-tl from-purple-50 to-pink-50 relative flex-1 w-3xs px-5 py-12 rounded-2xl flex flex-col gap-3">
                    <div className="howItIcon bg-white w-fit p-3 rounded-full shadow shadow-gray-300">
                        <i className="fa-solid fa-magnifying-glass text-pink-500 text-xl "></i>
                    </div>

                    <h3 className="font-bold  text-xl">Browse & select</h3>
                    <p className="text-gray-600 max-w-50">Search through our verified makeup and hair artists. Filter by location, price, and specialty to find your perfect match.</p>

                <div className="absolute -top-6 -left-2 bg-linear-to-b from-pink-400 to-pink-500 px-4 py-2 rounded-full shadow shadow-gray-500">
                    <p className="text-white font-semibold">1</p>
                </div>

                </div>

                <div className="howItCard bg-linear-to-tl from-purple-50 to-pink-50 relative flex-1 w-3xs px-5 py-12 rounded-2xl flex flex-col gap-3">
                    <div className="howItIcon bg-white w-fit p-3 rounded-full shadow shadow-gray-300">
                        <i className="fa-regular fa-calendar text-pink-500 text-xl "></i>
                    </div>

                    <h3 className="font-bold  text-xl">Book Your Appointment</h3>
                    <p className="text-gray-600 max-w-55">Choose your preferred date and time. View real-time availability and book instantly with our easy scheduling system.</p>

                <div className="absolute -top-6 -left-2 bg-linear-to-b from-pink-400 to-pink-500 px-4 py-2 rounded-full shadow shadow-gray-500">
                    <p className="text-white font-semibold">2</p>
                </div>

                </div>

                <div className="howItCard bg-linear-to-tl from-purple-50 to-pink-50 relative flex-1 w-3xs px-5 py-12 rounded-2xl flex flex-col gap-3">
                    <div className="howItIcon bg-white w-fit p-3 rounded-full shadow shadow-gray-300">
                        <LuCreditCard className="text-pink-500 text-xl" />
                    </div>

                    <h3 className="font-bold  text-xl">Secure Payment</h3>
                    <p className="text-gray-600 max-w-50">Pay securely online or choose to pay after service. All transactions are protected and your payment information is safe.</p>

                <div className="absolute -top-6 -left-2 bg-linear-to-b from-pink-400 to-pink-500 px-4 py-2 rounded-full shadow shadow-gray-500">
                    <p className="text-white font-semibold">3</p>
                </div>

                </div>

                <div className="howItCard bg-linear-to-tl from-purple-50 to-pink-50 relative flex-1 w-3xs px-5 py-12 rounded-2xl flex flex-col gap-3">
                    <div className="howItIcon bg-white w-fit p-3 rounded-full shadow shadow-gray-300">
                        <LuSparkles className="text-pink-500 text-xl " />

                    </div>

                    <h3 className="font-bold  text-xl">Get Glam!</h3>
                    <p className="text-gray-600 max-w-50">Your artist arrives at your location or you visit their studio. Enjoy professional beauty services and look stunning!</p>

                <div className="absolute -top-6 -left-2 bg-linear-to-b from-pink-400 to-pink-500 px-4 py-2 rounded-full shadow shadow-gray-500">
                    <p className="text-white font-semibold">4</p>
                </div>

                </div>

                
            </div>

        </div>
    </div>
    
    
    </>
  )
}
