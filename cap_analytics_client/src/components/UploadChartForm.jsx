import React, { useState } from 'react';
import {
  Box, Button, Typography, MenuItem, Select, InputLabel,
  FormControl, Stack, CircularProgress, TextField,
} from '@mui/material';
import { useUploadChartDataMutation, useGetChartNamesByCategoryQuery } from 'state/api';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const UploadChart = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadChart, { isLoading, error }] = useUploadChartDataMutation();
  const { handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      category: '',
      name: '',
      customName: '',
      chartType: 'line',
      chartSubtype: 'default',
    },
  });

  const selectedCategory = watch('category');
  const selectedName = watch('name');
  const selectedChartType = watch('chartType');

  const { data: nameResponse = {}, isFetching: fetchingNames } = useGetChartNamesByCategoryQuery(selectedCategory, {
    skip: !selectedCategory,
  });

  const dynamicNames = nameResponse.names || [];

  const chartTypeOptions = {
    line: ['default', 'monotone', 'step'],
    bar: ['default', 'grouped', 'stacked', 'percent'],
    pie: ['default', 'donut'],
    area: ['default', 'spline'],
    combo: ['line-bar', 'area-bar', 'multi-axis'],
  };

  const onSubmit = async ({ category, name, customName, chartType, chartSubtype }) => {
    const finalName = name === 'Other' ? customName : name;
    if (!file || !category || !finalName) {
      return alert('Please provide all required fields.');
    }

    const formData = new FormData();
    formData.append('file', file);
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
      <Typography variant="h4" mb={2}>Upload Chart Data</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
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

          {selectedCategory && (
            <FormControl fullWidth required>
              <InputLabel>Chart Name</InputLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Select {...field} label="Chart Name">
                    {dynamicNames.map((item) => (
                      <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                    <MenuItem value="Other">Other (Create new name)</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          )}

          {selectedName === 'Other' && (
            <TextField
              fullWidth
              required
              label="Custom Chart Name"
              {...control.register('customName')}
            />
          )}

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
