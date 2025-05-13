'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../actions/auth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }

    try {
      const response = await login(username, password);
      if (response.status === 200) {
        localStorage.setItem('token', response.token);
        router.push('/scan');
      } else if (response.status === 401) {
        setError('Not authenticated. Please check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to login. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/5 border border-[#f9dd9c33] backdrop-blur-md rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-[#f9dd9c]">Login to Your Account</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-[#f9dd9c]">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#f9dd9c66] rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f9dd9c]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block mb-1 text-[#f9dd9c]">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#f9dd9c66] rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f9dd9c]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#f9dd9c] text-black font-semibold rounded-md hover:bg-[#ffeaa6] transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
