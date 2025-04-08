import React, { useState } from "react";

export const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-blue-500 hover:text-blue-400 transition"
      >
        Toggle Popover
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 rounded-lg border border-white/10 bg-transparent shadow-lg p-4 transition-opacity duration-200 scale-95">
          {children}
        </div>
      )}
    </div>
  );
};

export const PopoverContent = ({ children }) => (
  <div className="p-3 bg-transparent border border-gray-600 text-white rounded-md shadow-md">
    {children}
  </div>
);

export const PopoverTrigger = ({ children }) => (
  <div className="cursor-pointer">{children}</div>
);
