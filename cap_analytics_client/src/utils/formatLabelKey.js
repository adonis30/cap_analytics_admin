// src/utils/formatLabelKey.js
export const formatLabelKey = (key) => {
  if (typeof key !== 'string') {
    if (key === null || key === undefined) return '';
    key = String(key); // convert numbers or others to string
  }

  return key
    .replace(/_/g, ' ')                // Replace underscores with space
    .replace(/\s+/g, ' ')              // Normalize spaces
    .trim()
    .replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    ); // Capitalize each word
};
