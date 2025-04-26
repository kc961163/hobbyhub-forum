// src/components/ui/Loading.jsx
import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  let sizeClasses;
  
  switch(size) {
    case 'small':
      sizeClasses = 'w-4 h-4 border-2';
      break;
    case 'large':
      sizeClasses = 'w-12 h-12 border-4';
      break;
    case 'medium':
    default:
      sizeClasses = 'w-8 h-8 border-3';
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses} border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin`}></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default Loading;