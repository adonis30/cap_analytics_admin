import React, { useState } from 'react';
import {
  Box, Typography, CircularProgress, Grid,
  FormControl, Select, MenuItem, InputLabel, Stack
} from '@mui/material';
import ChartPreview from './ChartPreview';
import { useGetChartsByCategoryQuery } from 'state/api';

const ChartsByCategory = ({ selectedCategory }) => {
  const [chartType, setChartType] = useState('');
  const [year, setYear] = useState('');

  const { data = [], isLoading, error } = useGetChartsByCategoryQuery({
    category: selectedCategory,
    chartType,
    year
  });

  const uniqueYears = [...new Set(data.flatMap(c => c.data.map(d => d.year)))].filter(Boolean);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{selectedCategory} Charts</Typography>

      <Stack direction="row" spacing={2} my={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select value={chartType} onChange={(e) => setChartType(e.target.value)} label="Chart Type">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
            <MenuItem value="area">Area</MenuItem>
            <MenuItem value="combo">Combo</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
            <MenuItem value="">All</MenuItem>
            {uniqueYears.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error loading charts</Typography>
      ) : (
        <Grid container spacing={3}>
          {data.map(({ metadata, data }) => (
            <Grid item xs={12} md={6} key={metadata._id}>
              <ChartPreview
                chartType={metadata.chartType}
                data={data}
                metadata={metadata}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ChartsByCategory;
