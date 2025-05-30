export const sanitizeChartData = (rawData = []) => {
  return rawData
    .map(({ _id, metadataId, __v, ...rest }) => {
      const cleaned = {};

      for (const key in rest) {
        const value = rest[key];

        if (
          key &&
          !key.startsWith('__') &&
          key !== '' &&
          value !== null &&
          value !== '' &&
          typeof value !== 'undefined'
        ) {
          cleaned[key.trim()] = isNaN(value) ? value : Number(value);
        }
      }

      return cleaned;
    })
    .filter((row) => Object.keys(row).length > 1); // Needs at least one X and one Y
};
