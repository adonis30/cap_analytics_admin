// src/scane/charts/Charts.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, useTheme,
  FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
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
  const [chartType, setChartType] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value=""><em>-- Select Category --</em></MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                label="Chart Type"
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="area">Area</MenuItem>
                <MenuItem value="pie">Pie</MenuItem>
                <MenuItem value="combo">Combo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Start Year</InputLabel>
              <Select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                label="Start Year"
              >
                <MenuItem value=""><em>Any</em></MenuItem>
                {[...Array(20)].map((_, i) => {
                  const y = 2010 + i;
                  return <MenuItem key={y} value={y}>{y}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={2}>
            <FormControl fullWidth>
              <InputLabel>End Year</InputLabel>
              <Select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                label="End Year"
              >
                <MenuItem value=""><em>Any</em></MenuItem>
                {[...Array(20)].map((_, i) => {
                  const y = 2010 + i;
                  return <MenuItem key={y} value={y}>{y}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2, height: 'fit-content' }}
          onClick={() => navigate('/charts/create')}
        >
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
