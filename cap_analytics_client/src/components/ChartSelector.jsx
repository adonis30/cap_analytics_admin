import React, { useState } from 'react';
import { useGetChartMetadataQuery } from 'state/api';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Box } from '@mui/material';

const ChartSelector = ({ onSelect }) => {
  const { data: metadata, isLoading, isError } = useGetChartMetadataQuery();
  const [selected, setSelected] = useState('');

  if (isLoading) return <CircularProgress />;
  if (isError || !metadata) return <p>Error loading metadata</p>;

  const handleChange = (e) => {
    setSelected(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <Box mt={2}>
      <FormControl fullWidth>
        <InputLabel>Select Chart Dataset</InputLabel>
        <Select value={selected} label="Select Chart Dataset" onChange={handleChange}>
          {metadata.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.title} ({new Date(item.uploadedAt).toLocaleDateString()})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChartSelector;
