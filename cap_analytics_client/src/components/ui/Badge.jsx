// src/components/ui/badge.jsx
import React from 'react';

export const Badge = ({ children, className }) => {
  return (
    <span className={`px-3 py-1 bg-gray-200 text-gray-800 rounded-full ${className}`}>
      {children}
    </span>
  );
};
