// src/components/ui/input.jsx
import React from 'react';

export const Input = ({ value, onChange, className, ...props }) => {
  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 border border-gray-300 rounded-lg ${className}`}
    />
  );
};
