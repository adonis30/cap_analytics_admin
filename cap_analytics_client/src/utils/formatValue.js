export const formatValue = (value, options = {}) => {
  const {
    prefix = "",
    suffix = "",
    notation = "compact", // "standard" | "compact" | "scientific"
    currency = false,
    digits = 2,
  } = options;

  if (typeof value !== "number" || isNaN(value)) return value;

  const formatter = new Intl.NumberFormat("en-US", {
    style: currency ? "currency" : "decimal",
    currency: currency ? "USD" : undefined,
    notation,
    maximumFractionDigits: digits,
  });

  return `${prefix}${formatter.format(value)}${suffix}`;
};
