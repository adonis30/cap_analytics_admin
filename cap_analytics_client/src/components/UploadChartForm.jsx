import React, { useState } from 'react';
import {
  Box, Button, Typography, MenuItem, Select, InputLabel,
  FormControl, Stack, CircularProgress, TextField,
} from '@mui/material';
import { useUploadChartDataMutation, useGetChartNamesByCategoryQuery } from 'state/api';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const regionOptions = [
  'Global', 'Africa', 'Asia', 'Europe', 'North America', 'South America'
];

const chartTypeOptions = {
  line: ['default', 'monotone', 'step'],
  bar: ['default', 'grouped', 'stacked', 'percent'],
  pie: ['default', 'donut'],
  area: ['default', 'spline'],
  combo: ['line-bar', 'area-bar', 'multi-axis'],
  map: ['choropleth'],
};

const UploadChart = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadChart, { isLoading, error }] = useUploadChartDataMutation();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      region: '',
      country: '',
      category: '',
      name: '',
      customName: '',
      chartType: 'line',
      chartSubtype: 'default',
    },
  });

  const region = watch('region');
  const selectedCategory = watch('category');
  const selectedName = watch('name');
  const selectedChartType = watch('chartType');

  const { data: nameResponse = {}, isFetching: fetchingNames } =
    useGetChartNamesByCategoryQuery(selectedCategory, {
      skip: !selectedCategory,
    });

  const dynamicNames = nameResponse.names || [];

  const onSubmit = async ({
    region,
    country,
    category,
    name,
    customName,
    chartType,
    chartSubtype,
  }) => {
    const finalName = name === 'Other' ? customName : name;

    const isMapChart = chartType === 'map';
    const isGlobal = region === 'Global';

    if (!file || !region || !category || !finalName) {
      return alert('Please fill in all required fields.');
    }

    if (!isGlobal && !country) {
      return alert('Please specify a country for non-global charts.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('region', region);
    if (!isGlobal) formData.append('country', country); // Skip if Global
    formData.append('category', category);
    formData.append('name', finalName);
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
      <Typography variant="h4" mb={2}>
        Upload Chart Data
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Region */}
          <FormControl fullWidth required>
            <InputLabel>Region</InputLabel>
            <Controller
              control={control}
              name="region"
              render={({ field }) => (
                <Select {...field} label="Region">
                  {regionOptions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Country (optional if Global) */}
          {region !== 'Global' && (
            <Controller
              control={control}
              name="country"
              rules={{ required: region !== 'Global' }}
              render={({ field }) => (
                <TextField {...field} fullWidth required label="Country" />
              )}
            />
          )}

          {/* Category */}
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

          {/* Name */}
          {selectedCategory && (
            <FormControl fullWidth required>
              <InputLabel>Chart Name</InputLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Select {...field} label="Chart Name">
                    {dynamicNames.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                    <MenuItem value="Other">Other (Create new name)</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          )}

          {/* Custom Name */}
          {selectedName === 'Other' && (
            <Controller
              control={control}
              name="customName"
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} fullWidth required label="Custom Chart Name" />
              )}
            />
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
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
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
// This code defines a React component for uploading chart data, allowing users to select various options like region, country, category, chart name, type, and subtype. It uses Material-UI for styling and React Hook Form for form management. The component handles file uploads and submits the data to an API endpoint using a mutation hook from a Redux slice. It also includes error handling and loading states.
// The component is designed to be user-friendly, guiding users through the upload process with clear labels