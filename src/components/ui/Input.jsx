// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ 
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = ''
}) => {
  // Add console.log to debug input interactions
  // console.log(`Input ${id}: value=${value}`);
  // 
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id} // Ensure name attribute matches id for handleChange
        type={type}
        value={value || ''} // Add fallback to prevent uncontrolled to controlled warning
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;