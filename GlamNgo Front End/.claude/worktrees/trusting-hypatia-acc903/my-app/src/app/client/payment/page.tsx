'use client'
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoReturnUpBack } from "react-icons/io5";



export default function ClientPayment() {
  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>Payment History</h1>
            <p className='text-gray-500 text-sm'>Manage your payments and biling information</p>
        </div>

        <div className='flex gap-3'>

        <div className='bg-pink-200 border border-pink-300 py-5 pe-25 ps-3 w-fit rounded-xl '>
            <p className='text-sm text-gray-500'>Total Spent </p>
            <h1 className='font-bold text-xl'>$255.00</h1>
            <p className='text-gray-500 text-xs'>This year</p>

        </div>

        <div className='shadow-lg py-5 pe-25 ps-3 w-fit rounded-xl '>
            <p className='text-sm text-gray-500'>Loyalty Points</p>
            <h1 className='font-bold text-xl'>350</h1>
            <p className='text-pink-500 text-xs'>$15.00 Credit</p>

        </div>

        </div>

        <div className='shadow-md border border-gray-200 p-3 rounded-md '>
            <h1 className='font-bold mb-3'>Transaction History</h1>

        <div className='flex flex-col gap-2'>
            <div className='border border-gray-100 rounded-md p-3 flex justify-between items-center'>

            <div className='flex gap-2 items-center'>

                <div className='bg-green-200 text-green-600 p-2 rounded-full h-fit w-fit '>
                    <FaRegCircleCheck className='text-lg'/>
                </div>

                <div>
                    <h1 className='font-bold'>Gel Manicure </h1>
                    <p className='text-gray-500 text-sm'>with Lisa k . Oct 10,2026 </p>
                    <p className='text-gray-500 text-xs'>Credit card ****4242</p>
                </div>

            </div>

            <div>
                <h2 className='font-bold'>$45.00</h2>
                <p className='text-green-500 font-semibold text-xs'>COMPLETED</p>
            </div>


        </div>

         <div className='border border-gray-100 rounded-md p-3 flex justify-between items-center'>

            <div className='flex gap-2 items-center'>

                <div className='bg-green-200 text-green-600 p-2 rounded-full h-fit w-fit '>
                    <FaRegCircleCheck className='text-lg'/>
                </div>

                <div>
                    <h1 className='font-bold'>Gel Manicure </h1>
                    <p className='text-gray-500 text-sm'>with Lisa k . Oct 10,2026 </p>
                    <p className='text-gray-500 text-xs'>Credit card ****4242</p>
                </div>

            </div>

            <div>
                <h2 className='font-bold'>$45.00</h2>
                <p className='text-green-500 font-semibold text-xs'>COMPLETED</p>
            </div>


        </div>

        <div className='border border-gray-100 rounded-md p-3 flex justify-between items-center'>

            <div className='flex gap-2 items-center'>

                <div className='bg-red-200 text-red-600 p-2 rounded-full h-fit w-fit '>
                    <IoReturnUpBack className='text-lg'/>
                </div>

                <div>
                    <h1 className='font-bold'>Gel Manicure </h1>
                    <p className='text-gray-500 text-sm'>with Lisa k . Oct 10,2026 </p>
                    <p className='text-gray-500 text-xs'>Credit card ****4242</p>
                </div>

            </div>

            <div className='text-red-500'>
                <h2 className='font-bold'>-0.00</h2>
                <p className='font-semibold text-xs'>Refunded</p>
            </div>


        </div>
            
        


        </div>



        </div>


     </div>
    </>
  )
}
