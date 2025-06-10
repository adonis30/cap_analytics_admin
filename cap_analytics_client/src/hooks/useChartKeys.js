import { useMemo } from 'react';

/**
 * Infers xKey and yKeys from chart data.
 * Prioritizes `display_month` or typical time-series keys.
 * Filters yKeys to include only numeric fields (including stringified numbers).
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

    // xKey priority order
    const xKey =
      keys.includes('display_month') ? 'display_month' :
      keys.includes('month_year') ? 'month_year' :
      keys.find((key) =>
        key.toLowerCase().includes('year') ||
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('label') ||
        key.toLowerCase().includes('category')
      ) || keys[0]; // fallback to first key

    // yKeys = all keys except xKey that contain numeric values
    const yKeys = keys.filter((key) => {
      if (key === xKey) return false;
      const val = sample[key];
      return typeof val === 'number' || (!isNaN(val) && val !== '');
    });

    return { xKey, yKeys };
  }, [data]);
};

export default useChartKeys;
