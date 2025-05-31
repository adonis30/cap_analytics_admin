import { useMemo } from 'react';

/**
 * Infers xKey and yKeys from chart data.
 * Prefers `display_month` as xKey.
 */
const useChartKeys = (data = []) => {
  return useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { xKey: null, yKeys: [] };
    }

    const sample = data[0];
    const keys = Object.keys(sample).filter(
      (k) => k !== '_id' && k !== 'metadataId' && k !== '__v'
    );

    const xKey =
      keys.includes('display_month') ? 'display_month' :
      keys.find((key) =>
        key.toLowerCase().includes('year') ||
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('label') ||
        key.toLowerCase().includes('category')
      ) || keys[0];

    // ✅ Only include numeric fields as yKeys
    const yKeys = keys.filter((k) =>
      k !== xKey && typeof sample[k] === 'number'
    );

    return { xKey, yKeys };
  }, [data]);
};

export default useChartKeys;
