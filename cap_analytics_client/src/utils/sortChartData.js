export const sortChartData = (data = [], xKey) => {
  if (!Array.isArray(data) || data.length === 0 || !xKey) return data;

  return [...data].sort((a, b) => {
    const aVal = a[xKey];
    const bVal = b[xKey];

    // ✅ Try to parse as number (e.g., year)
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // ✅ Fallback: try to parse as date
    const aDate = new Date(aVal);
    const bDate = new Date(bVal);
    if (!isNaN(aDate) && !isNaN(bDate)) {
      return aDate - bDate;
    }

    // ✅ Final fallback: string comparison
    return String(aVal).localeCompare(String(bVal));
  });
};
