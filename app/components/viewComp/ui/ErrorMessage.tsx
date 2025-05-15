import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {message || 'We encountered an error while trying to load the event details.'}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;