import { Button } from "@/components/ui/button";
import { RiVipCrownLine } from "react-icons/ri";
import HomeFooter from "../_components/HomeFooter/homeFooter";


export default function Membership() {
  return (
    <>
    <div className="bg-linear-to-b from-pink-50 to-purple-50 py-16">
        <div className="container w-[80%] mx-auto">

            <div className="flex flex-col items-center gap-3 text-center ">
                <p className="bg-linear-to-b from-pink-400 to-pink-500 text-white font-semibold text-sm w-fit p-2 rounded-full flex items-center gap-2">
                <RiVipCrownLine />
                SPECIAL OFFERS</p>

                <h1 className="font-bold text-5xl">Choose Your Plan</h1>
                <p className="text-gray-500">
                  Save more with our exclusive membership plans and enjoy premium benefits</p>
            </div>

        </div>

    </div>

    <div className="bg-white py-10">
     <div className="container w-[90%] mx-auto">

     <div className="flex flex-wrap justify-center gap-4">

      <div className="membership-card bg-linear-to-tl from-purple-50 to-pink-50 pt-7 pb-20  w-xs px-5 rounded-xl flex flex-col gap-5">
        <div className="headText">
          <h3 className="font-bold text-2xl mb-1">Basic</h3>
        <p className="text-gray-500">Perfect for trying us out</p>
        </div>

        <h2 className="text-pink-500 font-bold text-2xl">Free</h2>

        <ul>
          <li>
            <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Access to all artists</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Book services anytime</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Standard customer support</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Service history tracking</span>
        </li>


          </ul>
          </li>
        </ul>

        <Button className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full w-fit px-20 py-5 mx-auto ">Get Started</Button>

      </div>

      <div className="membership-card bg-linear-to-t text-white from-purple-500 to-pink-500 pt-7 pb-20  w-xs px-5 rounded-xl flex flex-col gap-5 shadow-xl shadow-gray-400">
        
        <div className="bg-white w-fit py-1 px-2 mx-auto rounded-full">
          <p className="text-pink-500 font-bold text-xs">MOST POPULAR</p>
        </div>

        <div className="headText">
          <h3 className="font-bold text-2xl mb-1">Premium</h3>
        <p>Perfect for trying us out</p>
        </div>

        <h2 className="font-bold text-2xl">299 EGP/month</h2>

        <ul>
          <li>
            <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check"></i> <span>10% off all services</span>
        </li>

        <li>
            <i className="fa-solid fa-check"></i> <span>Priority booking</span>
        </li>

        <li>
            <i className="fa-solid fa-check"></i> <span>Premium customer support</span>
        </li>

        <li>
            <i className="fa-solid fa-check"></i> <span>Exclusive artist access</span>
        </li>

         <li>
            <i className="fa-solid fa-check"></i> <span>AI Try-On unlimited</span>
        </li>

         <li>
            <i className="fa-solid fa-check"></i> <span>Monthly beauty tips</span>
        </li>

          </ul>
          </li>
        </ul>

        <Button className="bg-white text-pink-500 rounded-full w-fit px-20 py-5 mx-auto ">Subscribe Now</Button>

      </div>

      <div className="membership-card bg-linear-to-tl from-purple-50 to-pink-50 pt-7 pb-20  w-xs px-5 rounded-xl flex flex-col gap-5">
        <div className="headText">
          <h3 className="font-bold text-2xl mb-1">VIP</h3>
        <p className="text-gray-500">Ultimate beauty experience</p>
        </div>

        <h2 className="text-pink-500 font-bold text-2xl">599 EGP/month</h2>

        <ul>
          <li>
            <ul className="flex flex-col gap-3">
        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>20% off all services</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>VIP priority booking</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>24/7 dedicated support</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Free monthly service</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>All Premium features</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Personal beauty consultant</span>
        </li>

        <li>
            <i className="fa-solid fa-check text-green-500"></i> <span>Early access to new artists</span>
        </li>


          </ul>
          </li>
        </ul>

        <Button className="bg-linear-to-b from-pink-400 to-pink-500 rounded-full w-fit px-20 py-5 mx-auto ">Subscribe Now</Button>

      </div>


      </div>




     </div>
    </div>

    <HomeFooter/>
    
    </>
  )
}
