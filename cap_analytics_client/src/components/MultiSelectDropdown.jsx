import { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  IconButton,
  Stack,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelectDropdown = ({
  options = [],
  defaultValue = [],
  onChange = () => {},
  placeholder = "Select options...",
  createOption,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedValues(Array.isArray(defaultValue) ? defaultValue : []);
  }, [defaultValue]);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (event) => {
    const { value } = event.target;

    // Handle select all logic
    if (value.includes("select-all")) {
      const newSelected =
        selectedValues.length === filteredOptions.length
          ? []
          : filteredOptions.map((opt) => opt.value);
      setSelectedValues(newSelected);
      onChange(newSelected);
      return;
    }

    // Handle individual selection
    setSelectedValues(value);
    onChange(value);
  };

  const handleSearchChange = (e) => {
    e.stopPropagation();
    setSearchQuery(e.target.value);
  };

  const handleAddOption = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newOption.trim()) return;

    const addedOption = await createOption(newOption);
    if (addedOption) {
      const newSelected = [...selectedValues, addedOption.value];
      setSelectedValues(newSelected);
      onChange(newSelected);
    }
    setNewOption("");
  };

  const isAllSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) => selectedValues.includes(option.value));

  const isIndeterminate =
    selectedValues.length > 0 &&
    selectedValues.length < filteredOptions.length &&
    filteredOptions.some((option) => selectedValues.includes(option.value));

  const getSelectedLabels = () =>
    options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label)
      .join(", ");

      

  return (
    <FormControl fullWidth>
      <Select
        multiple
        displayEmpty
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected || selected.length === 0) {
            return placeholder;
          }
          return getSelectedLabels();
        }}
        MenuProps={{
          ...MenuProps,
          autoFocus: false,
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
            p: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <MenuItem value="select-all">
          <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} />
          <ListItemText primary="Select All" />
        </MenuItem>

        <Divider />

        {filteredOptions.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No options found" />
          </MenuItem>
        ) : (
          filteredOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={selectedValues.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))
        )}

        {createOption && (
          <>
            <Divider />
            <Box
              component="form"
              onSubmit={handleAddOption}
              sx={{ p: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  onClick={(e) => e.stopPropagation()}
                />
                <IconButton size="small" type="submit" color="primary">
                  <AddIcon />
                </IconButton>
              </Stack>
            </Box>
          </>
        )}
      </Select>
    </FormControl>
  );
};

export default MultiSelectDropdown;
