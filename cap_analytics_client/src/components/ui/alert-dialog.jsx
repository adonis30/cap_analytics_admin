"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "lib/utils"; // Ensure this exists or update path

export function AlertDialog({ children, title, description, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6 shadow-lg rounded-lg border border-white/10 bg-transparent">
          <Dialog.Close className="absolute right-4 top-4 text-white hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </Dialog.Close>
          <Dialog.Title className="text-lg font-bold text-white">{title}</Dialog.Title>
          <Dialog.Description className="text-gray-300">{description}</Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <Dialog.Close className="px-4 py-2 bg-gray-700/50 text-white rounded hover:bg-gray-600/80 transition">
              Cancel
            </Dialog.Close>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 🔹 Additional exports for modular use
export const AlertDialogTrigger = Dialog.Trigger;
export const AlertDialogContent = Dialog.Content;
export const AlertDialogHeader = ({ children }) => <div className="p-4">{children}</div>;
export const AlertDialogTitle = Dialog.Title;
export const AlertDialogDescription = Dialog.Description;
export const AlertDialogFooter = ({ children }) => <div className="flex justify-end p-4">{children}</div>;
export const AlertDialogCancel = Dialog.Close;
export const AlertDialogAction = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
    {children}
  </button>
);
