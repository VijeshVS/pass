'use client'
import React from 'react';
import PassGrid from '../components/PassGrid';

const PassesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Pass Management Portal</h1>
          <p className="text-blue-100 max-w-2xl">
            View and manage all passes and registrations in one place. Send emails, 
            check participant details, and track attendance with ease.
          </p>
        </div>
      </div>
      
      <main className="py-8">
        <PassGrid />
      </main>
    </div>
  );
};

export default PassesPage;