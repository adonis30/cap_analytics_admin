import { useMemo } from 'react';

/**
 * Hook to infer xKey (usually the first column like year/category) and yKeys (numeric values)
 * @param {Array<Object>} data
 * @returns {{ xKey: string, yKeys: string[] }}
 */
const useChartKeys = (data = []) => {
  return useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return { xKey: null, yKeys: [] };

    const sample = data[0];
    const keys = Object.keys(sample).filter(
      (k) => k !== '_id' && k !== 'metadataId' && k !== '__v'
    );

    // ✅ Prefer 'display_month' if present
    const xKey =
      keys.includes('display_month') ? 'display_month' :
      keys.find((key) =>
        key.toLowerCase().includes('year') ||
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('label') ||
        key.toLowerCase().includes('category')
      ) || keys[0]; // fallback to first valid key

    const yKeys = keys.filter((k) => k !== xKey);

    return { xKey, yKeys };
  }, [data]);
};

export default useChartKeys;
