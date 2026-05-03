'use client'
import { TbCash } from "react-icons/tb";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaCalculator } from "react-icons/fa6";
import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import { Payment, Summary } from "@/types/payment.type";
import { Badge } from "@/components/ui/badge";





export default function AdminPayment() {
const [payments, setPayments] = useState<Payment[]>([]);
const [summary, setSummary] = useState<Summary | null>(null);
const [loading, setLoading] = useState(true); 
const completed = payments.filter(p => p.status === 'COMPLETED').length;
const pending = payments.filter(p => p.status === 'PENDING').length;

useEffect(() => {
  const loadPayments = async () => {
    try {
      const res = await fetch('/api/payment', {
      });

      const data = await res.json();

      setPayments(data.payments || []);
      setSummary(data.summary || null);

    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  loadPayments();
}, []);







  return (
<>
<div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-4'>

    <div>
        <h2 className='font-semibold text-3xl'>Payment managemenet</h2>
        <p className='text-pink-500'>View total payments made for services and check completion status</p>
    </div>

    <div className="flex flex-wrap gap-3">

    <div className='p-5 shadow-md rounded-md lg:w-[23%] w-xs flex flex-col gap-2'>
        <p className="bg-pink-100 w-fit p-3 rounded-md"> <TbCash className="text-pink-500 text-2xl"/> </p>

            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="font-bold text-3xl">${summary?.totalRevenue.toFixed(2) || "0.00"}</p>
    </div>

    <div className='p-5 shadow-md rounded-md lg:w-[23%] w-xs flex flex-col gap-2'>
        <p className="bg-green-100 w-fit p-3 rounded-md"> <FaRegCircleCheck className="text-green-500 text-2xl"/> </p>

            <h3 className="text-gray-500">Completed Payments</h3>
            <p className="font-bold text-3xl text-green-500">{summary?.completedPayments || '0'}</p>
            <p className="text-gray-500 text-sm">{completed} Payments</p>
    </div>

    <div className='p-5 shadow-md rounded-md lg:w-[23%] w-xs flex flex-col gap-2'>
        <p className="bg-yellow-100 w-fit p-3 rounded-md"> <FaRegClock className="text-yellow-500 text-2xl"/> </p>

            <h3 className="text-gray-500">Pending Payments</h3>
            <p className="font-bold text-3xl text-yellow-500">${summary?.pendingAmounts.toFixed(2) || "00.0"}</p>
            <p className="text-gray-500 text-sm">{pending} payments</p>
    </div>

    <div className='p-5 shadow-md rounded-md lg:w-[23%] w-xs flex flex-col gap-2'>
        <p className="bg-blue-100 w-fit p-3 rounded-md"> <FaCalculator className="text-blue-500 text-2xl"/> </p>

            <h3 className="text-gray-500">Total Transaction</h3>
            <p className="font-bold text-3xl">{summary?.totalTransactions || "0"}</p>
    </div>


    </div>

    <div>
        <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.45 }}
  className='rounded-xl border border-gray-100 shadow-sm lg:w-full w-md'
>
  <div className='px-5 py-3 border-b border-gray-100 flex items-center justify-between'>
    <h2 className='font-bold text-lg'>All Transaction</h2>
        <div>
            <p className="font-bold">{summary?.completedPayments}</p>
            <p className="text-gray-500 text-sm">Completed</p>
        </div>
  </div>

  <div className='overflow-x-auto'>
    <table className='lg:w-full text-sm'>
      <thead className='bg-gray-50 text-gray-600 text-xs uppercase'>
        <tr>
          <th className='px-4 py-2 text-left'>Client</th>
          <th className='px-4 py-2 text-left'>Artist</th>
          <th className='px-4 py-2 text-left'>Amount</th>
          <th className='px-4 py-2 text-left'>payment method</th>
          <th className='px-4 py-2 text-left'>status</th>
        </tr>
      </thead>

      <tbody>
        {payments.length == 0 ? (
            <tr>
                <td className="p-5 border border-dotted border-gray-200">
                    No payments found
                </td>
            </tr>
        ) :(
            payments.map((p) => (
                    <tr className='border-t border-gray-100' key={p.id}>
          <td className='px-4 py-2'>{p.client_name}</td>
          <td className='px-4 py-2'>{p.provider_name}</td>
          <td className='px-4 py-2 font-bold'>${p.amount.toFixed(2)}</td>
          <td className='px-4 py-2'>{p.method}</td>
          <td className='px-4 py-2 text-left font-semibold'> <Badge className={`${p.status == 'COMPLETED' ? 'bg-green-100 text-green-500' : 'bg-yellow-100 text-yellow-500'}  `}>
            {p.status}
            </Badge> </td>
        </tr>
            ))
        )}

      </tbody>
    </table>
  </div>
</motion.div>
    </div>



</div>

</>
)
}
