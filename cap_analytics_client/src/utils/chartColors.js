const chartColorsByCategory = {
  'Macroeconomic Overview': ['#1976d2', '#64b5f6', '#bbdefb'],
  'Business Climate': ['#388e3c', '#81c784', '#c8e6c9'],
  'Investment Trends': ['#f57c00', '#ffb74d', '#ffe0b2'],
  default: ['#9e9e9e', '#bdbdbd', '#e0e0e0'],
};

export const getChartColors = (category) => {
  return chartColorsByCategory[category] || chartColorsByCategory.default;
};
