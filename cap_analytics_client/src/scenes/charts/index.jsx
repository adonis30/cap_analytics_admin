// src/scane/charts/Charts.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetChartsByCategoryQuery } from 'state/api';
import Header from 'components/Header';
import ChartPreview from './ChartPreview';

const categories = [
  'Macroeconomic Overview',
  'Business Climate',
  'Investment Trends',
];

const Charts = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const [chartType, setChartType] = useState('');
const [startYear, setStartYear] = useState('');
const [endYear, setEndYear] = useState('');

const {
  data: charts = [],
  isFetching,
  error,
} = useGetChartsByCategoryQuery(
  { category: selectedCategory, chartType, startYear, endYear },
  { skip: !selectedCategory }
);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Charts" subtitle="Dynamic chart rendering from uploaded data" />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="subtitle1" mb={1}>Filter Chart by Category</Typography>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              fontSize: '16px',
              minWidth: '250px',
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Box>

        <Button variant="contained" color="primary" onClick={() => navigate('/charts/create')}>
          Upload Chart Data
        </Button>
      </Box>

      {isFetching ? (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Failed to load charts.</Typography>
      ) : charts.length === 0 ? (
        <Typography mt={4}>No charts found for selected category.</Typography>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(600px, 1fr))" gap={4}>
          {charts.map(({ _id, chartType, data, ...metadata }) => (
            <ChartPreview
              key={_id}
              chartType={chartType}
              data={data}
              metadata={{ ...metadata, _id }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Charts;
