'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkIfAuthenticated, login } from '../actions/auth';
import { toast } from 'sonner';
import Loading from '../components/Loading';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading,setLoading] = useState(true)

  useEffect(() => {
      checkIfAuthenticated(localStorage.getItem('token') || '').then((check) => {
        if (!check) {
          setLoading(false);
        } else {
          router.push('/')
          toast.error('User already logged in !!');
        }
      });
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }

    // Show loading toast and store the toast ID
    const loadingToastId = toast.loading('Logging in...', {
      id: 'login-loading',
    });

    try {
      const response = await login(username, password);

      // Dismiss loading toast after login attempt
      toast.dismiss(loadingToastId);

      if (response.status === 200) {
        localStorage.setItem('token', response.token);
        toast.success('Login successful!', {
          id: 'login-success',
        });
        router.push('/');
      } else if (response.status === 401) {
        setError('Not authenticated. Please check your credentials.');
        toast.error('Invalid credentials, please try again.', {
          id: 'login-error',
        });
      } else {
        setError('An unexpected error occurred.');
        toast.error('Something went wrong, please try again later.', {
          id: 'unexpected-error',
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to login. Please try again later.');
      toast.error('Failed to login. Please try again later.', {
        id: 'login-error',
      });
    }
  };

  if(loading) return <Loading/>

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
