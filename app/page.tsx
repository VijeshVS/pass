'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkIfAuthenticated } from './actions/auth';
import { toast } from 'sonner';
import Loading from './components/Loading';

export default function Home() {
  const router = useRouter();
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    checkIfAuthenticated(localStorage.getItem('token') || '').then((check) => {
      if (check) {
        setLoading(false);
      } else {
        router.push('/login');
        toast.error('Please login to continue');
      }
    });
  }, []);

  if(loading) return <Loading/>

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white/5 backdrop-blur-md border border-[#f9dd9c33] rounded-xl p-10 shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-3 text-[#f9dd9c]">
          Pass Approval System
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Secure, Fast & Reliable Entry Management
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/scan')}
            className="px-6 py-3 border border-[#f9dd9c] text-[#f9dd9c] font-semibold rounded-md hover:bg-[#f9dd9c] hover:text-black transition duration-200"
          >
            📷 Scan QR
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-[#f9dd9c] text-[#f9dd9c] font-semibold rounded-md hover:bg-[#f9dd9c] hover:text-black transition duration-200"
          >
            🧔🏻‍♂️ Admin
          </button>
        </div>
      </div>
    </div>
  );
}
