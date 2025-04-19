// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button',
  fullWidth = false
}) => {
  // Define styles based on variant and size
  let variantClasses = '';
  
  switch(variant) {
    case 'primary':
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 hover:bg-red-700 text-white';
      break;
    default:
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white';
  }
  
  let sizeClasses = '';
  
  switch(size) {
    case 'small':
      sizeClasses = 'py-1 px-3 text-sm';
      break;
    case 'medium':
      sizeClasses = 'py-2 px-4';
      break;
    case 'large':
      sizeClasses = 'py-3 px-6 text-lg';
      break;
    default:
      sizeClasses = 'py-2 px-4';
  }
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${variantClasses} ${sizeClasses} ${widthClass} rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;