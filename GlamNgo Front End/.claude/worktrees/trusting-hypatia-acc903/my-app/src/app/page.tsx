'use client'
import HeaderSearch from "./_components/HeaderSearch/headerSearch";
import Bundels from "./_components/Bundels/bundels";
import GlamNgo from "./_components/GlamNgo/glamNgo";
import OurServices from "./_components/OurServices/ourServices";
import Artists from "./artists/page";
import HowItWorks from "./_components/HowItWorks/howItWorks";
import GetStart from "./_components/GetStart/getStart";
import HomeFooter from "./_components/HomeFooter/homeFooter";


export default function Home() {
  return (
   <>
   <HeaderSearch/>
 <div className="bg-white">
   <Bundels/> 
 </div>
  <Artists/>

    <div className="bg-white py-8">
       <div className="service text-center">
            <h1 className="font-bold text-3xl">Our Services</h1>
            <p className="text-gray-500">Professional beauty services delivered by expert artists</p>
        </div>
  <OurServices/>
    </div>


  <GlamNgo/>

<div className="bg-white py-6">
   <div className="flex flex-col items-center text-center">
        <h1 className="font-bold text-3xl">How It Works</h1>
        <p className="text-gray-500">Booking your perfect beauty experience is simple and and seamless</p>
    </div>
<HowItWorks/>
</div>

<GetStart/>

<HomeFooter/>
   
   </>
  );
}
