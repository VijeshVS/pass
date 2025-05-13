"use client";
import React, { useState } from 'react';
import { register } from '../actions/auth';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await register(username, password, role);
    setStatus(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 transition duration-300">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              placeholder="Enter a secure password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            >
              <option value="" disabled>Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {status === 201 && (
          <p className="mt-4 text-center text-green-600 font-medium">
            ✅ Registration successful!
          </p>
        )}
        {status === 500 && (
          <p className="mt-4 text-center text-red-600 font-medium">
            ❌ Registration failed. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
