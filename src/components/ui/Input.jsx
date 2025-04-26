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
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="form-label"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-control ${error ? 'border-danger' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Input;