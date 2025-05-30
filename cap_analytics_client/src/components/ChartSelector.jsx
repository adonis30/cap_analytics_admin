// components/ChartSelector.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { useGetChartMetadataQuery } from "state/api";

const categories = [
  "Macroeconomic Overview",
  "Business Climate",
  "Investment Trends",
];

const chartTypes = ["line", "bar", "area", "pie", "combo"];

const ChartSelector = ({ onSelect }) => {
  const { data: metadataList = [], isLoading } = useGetChartMetadataQuery();
  const [filters, setFilters] = useState({
    category: "",
    chartType: "",
    yearFrom: "",
    yearTo: "",
  });

  const [filteredCharts, setFilteredCharts] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
  if (filteredCharts.length > 0 && !selected) {
    const firstId = filteredCharts[0]._id;
    setSelected(firstId);
    if (onSelect) onSelect(firstId);
  }
}, [filteredCharts, selected]);

  useEffect(() => {
    if (!metadataList) return;

    const result = metadataList.filter((m) => {
      const matchCategory =
        !filters.category || m.category === filters.category;
      const matchType = !filters.chartType || m.chartType === filters.chartType;

      const matchYearRange = (() => {
        if (!filters.yearFrom && !filters.yearTo) return true;

        const dataYears = m.yearRange || []; // if yearRange is stored
        const [minYear, maxYear] =
          dataYears.length === 2 ? dataYears : [null, null];
        const from = filters.yearFrom ? parseInt(filters.yearFrom) : null;
        const to = filters.yearTo ? parseInt(filters.yearTo) : null;

        return (!from || minYear >= from) && (!to || maxYear <= to);
      })();

      return matchCategory && matchType && matchYearRange;
    });

    setFilteredCharts(result);
  }, [filters, metadataList]);

  const handleSelect = (e) => {
    const chartId = e.target.value;
    setSelected(chartId);
    if (onSelect) onSelect(chartId);
  };

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        Filter Chart Dataset
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={filters.chartType}
              label="Chart Type"
              onChange={(e) =>
                setFilters({ ...filters, chartType: e.target.value })
              }
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {chartTypes.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            label="Year From"
            type="number"
            fullWidth
            value={filters.yearFrom}
            onChange={(e) =>
              setFilters({ ...filters, yearFrom: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            label="Year To"
            type="number"
            fullWidth
            value={filters.yearTo}
            onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel>Select Chart</InputLabel>
          <Select value={selected} onChange={handleSelect} label="Select Chart">
            {filteredCharts.map((chart) => (
              <MenuItem key={chart._id} value={chart._id}>
                {chart.category} - {chart.name || chart.title} (
                {new Date(chart.uploadedAt).getFullYear()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ChartSelector;
