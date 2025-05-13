import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'py-6'} bg-black w-full`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#f9dd9c] border-t-transparent rounded-full animate-spin" />
        {message && <p className="text-sm text-[#f9dd9c]">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
