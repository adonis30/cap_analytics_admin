// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ children, className, ...props }) => {
  return (
    <button {...props} className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${className}`}>
      {children}
    </button>
  );
};
