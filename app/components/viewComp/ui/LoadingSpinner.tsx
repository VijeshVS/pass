import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading event details...</p>
    </div>
  );
};

export default LoadingSpinner;