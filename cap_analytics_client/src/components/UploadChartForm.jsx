import React, { useState } from 'react';
import {
  Box, Button, Typography, MenuItem, Select, InputLabel,
  FormControl, Stack, CircularProgress, TextField,
} from '@mui/material';
import { useUploadChartDataMutation } from 'state/api';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const macroeconomicOptions = [
  "Economic Growth",
  "Inflation and exchange rate",
  "Preliminary Annual GDP, 2024",
  "Purchasing Manager's Index",
  "Commecial Bank lending Rate",
  "population growth rate",
  "Central Govt External Debt (US$ bn), SOE External Debt (US$ bn) and Domestic Debt (K bn)"
];

const businessClimateOptions = [
  "Ease of Starting a Business",
  "Business Confidence Index",
  "Regulatory Quality Index",
  "Corruption Perception Index",
  "Business Taxation Metrics",
  "Ease of Obtaining Permits",
];

const investmentOptions = [
  "Ease of Doing Business Score 2021 to 2024",
  "FDI Inflows and Gdp growth rate(2021-2023)",
  "Actualised Investments by Sector in (millions)  2021– 2024 ",
  "FDI Inflows (USD Million)",
  "Cut-off Coupon Rate  and Cut-off Yield Rate 2025",
  "Total Liabilities (USD Billion) and Change"
];

const chartTypeOptions = {
  line: ["default", "monotone", "step"],
  bar: ["default", "grouped", "stacked", "percent"],
  pie: ["default", "donut"],
  area: ["default", "spline"],
  combo: ["line-bar", "area-bar", "multi-axis"]
};

const UploadChart = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadChart, { isLoading, error }] = useUploadChartDataMutation();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      category: '',
      name: '',
      chartType: 'line',
      chartSubtype: 'default',
    }
  });

  const selectedCategory = watch('category');
  const selectedChartType = watch('chartType');

  const getOptionsByCategory = (category) => {
    switch (category) {
      case 'Macroeconomic Overview': return macroeconomicOptions;
      case 'Business Climate': return businessClimateOptions;
      case 'Investment Trends': return investmentOptions;
      default: return [];
    }
  };

  const onSubmit = async ({ category, name, chartType, chartSubtype }) => {
    if (!file || !category || !name) return alert('Please provide all required fields.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('name', name);
    formData.append('chartType', chartType);
    formData.append('chartSubtype', chartSubtype);

    try {
      await uploadChart(formData).unwrap();
      alert('Chart uploaded successfully');
      navigate('/charts');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4" mb={2}>Upload Chart Data</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>

          {/* Chart Category */}
          <FormControl fullWidth required>
            <InputLabel>Chart Category</InputLabel>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select {...field} label="Chart Category">
                  <MenuItem value="Macroeconomic Overview">Macroeconomic Overview</MenuItem>
                  <MenuItem value="Business Climate">Business Climate</MenuItem>
                  <MenuItem value="Investment Trends">Investment Trends</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Chart Name */}
          {selectedCategory && (
            <FormControl fullWidth required>
              <InputLabel>Chart Name</InputLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Select {...field} label="Chart Name">
                    {getOptionsByCategory(selectedCategory).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )}

          {/* Chart Type */}
          <FormControl fullWidth required>
            <InputLabel>Chart Type</InputLabel>
            <Controller
              control={control}
              name="chartType"
              render={({ field }) => (
                <Select {...field} label="Chart Type">
                  {Object.keys(chartTypeOptions).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Chart Subtype */}
          <FormControl fullWidth>
            <InputLabel>Chart Subtype</InputLabel>
            <Controller
              control={control}
              name="chartSubtype"
              render={({ field }) => (
                <Select {...field} label="Chart Subtype">
                  {chartTypeOptions[selectedChartType]?.map((sub) => (
                    <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* File Upload */}
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>

          {error && (
            <Typography color="error">
              Upload failed: {error?.data?.error || 'Unknown error'}
            </Typography>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default UploadChart;
