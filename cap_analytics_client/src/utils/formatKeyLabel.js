/**
 * Converts snake_case or underscore-separated keys to readable labels.
 * Example: "month_year" → "Month Year", "exchange_rate_usd_to_zmw_" → "Exchange Rate USD to ZMW"
 */
const formatKeyLabel = (key = '') => {
  return key
    .replace(/^_+|_+$/g, '') // Trim leading/trailing underscores
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default formatKeyLabel;
