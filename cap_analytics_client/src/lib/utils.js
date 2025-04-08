import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes dynamically.
 * @param inputs - Class names or conditions
 * @returns Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
