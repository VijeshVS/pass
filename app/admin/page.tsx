'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkIfAuthenticated } from '../actions/auth';
import { toast } from 'sonner';
import Loading from '../components/Loading';

export default function AdminRedirectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center p-10 border-4 border-transparent rounded-3xl bg-gradient-to-br from-black via-black to-gray-900 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-[-1] rounded-3xl border-2 border-[#f9dd9c] opacity-30 blur-lg animate-pulse"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-[#f9dd9c] drop-shadow-lg mb-8 tracking-wide">
          Welcome to the Admin Panel
        </h1>

        <p className="text-lg md:text-xl text-[#f9dd9c]/80 mb-10">
          Manage events, users, and more with full control.
        </p>

        <button
          onClick={() => router.push('/admin/events')}
          className="relative inline-block px-8 py-4 font-semibold text-black bg-[#f9dd9c] rounded-full shadow-md hover:bg-yellow-300 transition duration-300 group"
        >
          <span className="absolute inset-0 rounded-full bg-[#f9dd9c] blur-xl opacity-20 group-hover:opacity-40 transition duration-300"></span>
          <span className="relative z-10">Go to Events</span>
        </button>
      </div>
    </div>
  );
}
