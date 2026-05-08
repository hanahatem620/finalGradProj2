'use client'
import { Payment, Summary } from "@/types/payment.type";
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoReturnUpBack } from "react-icons/io5";

export default function ProviderPayment() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

 async function fetchPayments() {
  try {
    const res = await fetch('/api/payment', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    return data;

  } catch (error) {
    console.error("Fetch payments error:", error);
    throw error;
  }
}

useEffect(() => {
  const loadPayments = async () => {
    try {
      setLoading(true);

      const data = await fetchPayments();

      setPayments(data.payments || []);
      setSummary(data.summary || null);

    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  loadPayments();
}, []);

  if (loading) {
    return <div className="py-20 text-center text-pink-500 font-bold">Loading payments...</div>;
  }

  return (
    <>
     <div className='container lg:w-[80%] w-[90%] mx-auto py-10 flex flex-col gap-5'>

        <div>
            <h1 className='font-bold text-3xl'>Payment History</h1>
            <p className='text-gray-500 text-sm'>Manage your payments and billing information</p>
        </div>

        <div className='flex flex-wrap gap-3'>

            <div className='bg-pink-100 border border-pink-200 p-5  lg:w-xs w-sm rounded-xl '>
                <p className='text-sm text-gray-500 font-medium'>Total Revenue </p>
                <h1 className='font-bold text-2xl '>${summary?.totalEarned?.toFixed(2) || "0.00"}</h1>
                <p className='text-gray-400 text-xs mt-1'>This Year</p>
            </div>

            <div className='bg-white shadow-sm border border-gray-100 p-5 lg:w-xs w-sm rounded-xl '>
                <p className='text-sm text-gray-500 font-medium'>Loyalty Points</p>
                <h1 className='font-bold text-2xl text-gray-800'>{summary?.loyaltyPoints || 0}</h1>
                <p className='text-pink-500 text-xs font-semibold mt-1'>${((summary?.loyaltyPoints || 0) * 0.05).toFixed(2)} Credit</p>
            </div>

        </div>

        <div className='bg-white shadow-sm border border-gray-200 p-6 rounded-xl '>
            <h1 className='font-bold text-lg mb-5'>Transaction History</h1>

            <div className='flex flex-col gap-3'>
                {payments.length === 0 ? (
                    <p className="text-center py-10 text-gray-400">No transactions found.</p>
                ) : (
                    payments.map((tx) => {
                        const isCompleted = tx.status === 'COMPLETED';
                        const dateFormatted = new Date(tx.created_at).toLocaleDateString('en-US', {
                           month: 'short',
                           day: 'numeric',
                           year: 'numeric'
                        });

                        return (
                            <div key={tx.id} className='border border-gray-100 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors'>
                                <div className='flex gap-3 items-center'>
                                    <div className={`${isCompleted ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} p-2.5 rounded-full transition-all`}>
                                        {isCompleted ? (
                                            <FaRegCircleCheck className='text-xl'/>
                                        ) : (
                                            <IoReturnUpBack className='text-xl'/>
                                        )}
                                    </div>

                                    <div>
                                        <p className='text-gray-500 text-sm'>
                                            with {tx.client_name } • {dateFormatted}
                                        </p>
                                        <p className='text-gray-400 text-xs mt-0.5 tracking-wide uppercase font-medium'>
                                            {tx.method} payment
                                        </p>
                                    </div>
                                </div>

                                <div className='text-right'>
                                    <h2 className={`font-bold text-lg ${!isCompleted ? 'text-red-500' : 'text-gray-800'}`}>
                                        {isCompleted ? `${tx.amount.toFixed(2)}` : `-${tx.amount.toFixed(2)}`}
                                    </h2>
                                    <p className={`${isCompleted ? 'text-green-500' : 'text-red-500'} font-bold text-[0.65rem] uppercase tracking-wider`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
     </div>
    </>
  )
}

