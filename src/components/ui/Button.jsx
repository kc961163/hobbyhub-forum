// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button',
  className = ''
}) => {
  // Define variant and size classes
  let variantClass = '';
  let sizeClass = '';
  
  // Set variant class
  switch(variant) {
    case 'primary':
      variantClass = 'btn-primary';
      break;
    case 'secondary':
      variantClass = 'btn-secondary';
      break;
    case 'danger':
      variantClass = 'btn-danger';
      break;
    default:
      variantClass = 'btn-primary';
  }
  
  // Set size class
  switch(size) {
    case 'small':
      sizeClass = 'btn-sm';
      break;
    case 'large':
      sizeClass = 'btn-lg';
      break;
    default:
      sizeClass = '';
  }
  
  const buttonClasses = `btn ${variantClass} ${sizeClass} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;