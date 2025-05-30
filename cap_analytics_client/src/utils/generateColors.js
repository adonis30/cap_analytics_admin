// utils/generateColors.js
export const generateColors = (input) => {
  const defaultColors = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc949', '#af7aa1', '#ff9da7',
    '#9c755f', '#bab0ab'
  ];

  if (typeof input === 'number') {
    const extended = [];
    while (extended.length < input) {
      extended.push(...defaultColors);
    }
    return extended.slice(0, input);
  }

  // fallback to deterministic color
  const hash = input.toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return [defaultColors[hash % defaultColors.length]];
};
