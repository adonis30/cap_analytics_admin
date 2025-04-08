import { useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';

const MultiSelects = ({ options, selectedValues, onChange }) => {
  const isAllSelected = selectedValues.length === options.length;

  const handleValueChange = (event) => {
    const value = event.target.value;

    if (value.includes('all')) {
      onChange(isAllSelected ? [] : options.map((opt) => opt.value));
      return;
    }

    onChange(value);
  };

  return (
    <FormControl sx={{ width: 'auto' }}>
      <Select
        multiple
        value={selectedValues}
        onChange={handleValueChange}
        renderValue={(selected) =>
          selected.map((val) => options.find((opt) => opt.value === val)?.label).join(', ')
        }
      >
        {/* Select All */}
        <MenuItem value="all">
          <ListItemIcon>
            <Checkbox checked={isAllSelected} />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>

        {/* Individual Options */}
        {options.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            <ListItemIcon>
              <Checkbox checked={selectedValues.includes(option.value)} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelects;
