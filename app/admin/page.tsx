'use client';

import { useRouter } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#f9dd9c]">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to the Admin Panel
      </h1>
      <button
        onClick={() => router.push('/admin/events')}
        className="bg-[#f9dd9c] text-black font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-yellow-300 transition-all duration-300"
      >
        Go to Events
      </button>
    </div>
  );
}
