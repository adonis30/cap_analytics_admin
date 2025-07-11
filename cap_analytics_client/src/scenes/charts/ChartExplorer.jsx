import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import ChoroplethMapComponent from "components/chartsView/ChoroplethMapComponent";
import ChartPreview from "./ChartPreview";
import Header from "components/Header";
import worldGeoJson from "utils/world-geo.json";
import countries from "utils/isoCountries";

import {
  useGetChartMetadataQuery,
  useGetChartsByCategoryQuery,
} from "state/api";

const categories = [
  "Macroeconomic Overview",
  "Business Climate",
  "Investment Trends",
];

const ChartExplorer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const chartsRef = useRef();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chartType, setChartType] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const { data: metadataList = [], isFetching: loadingMeta } = useGetChartMetadataQuery();

  const {
    data: charts = [],
    isFetching,
    error,
  } = useGetChartsByCategoryQuery(
    { category: selectedCategory, chartType, startYear, endYear },
    { skip: !selectedCategory }
  );

  const handleCountryClick = (isoCode) => {
    setSelectedCountry(isoCode || "GLB");
  };

  const exportAllChartsToPDF = async () => {
    if (!chartsRef.current) return;
    const canvas = await html2canvas(chartsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save(`charts_${selectedCountry}.pdf`);
  };

  const regionValues = useMemo(() => {
    const scores = {};
    metadataList.forEach((meta) => {
      if (!meta.country) return;
      scores[meta.country] = (scores[meta.country] || 0) + 1;
    });
    return scores;
  }, [metadataList]);


 const filteredCharts = useMemo(() => {
  if (!selectedCountry) return [];

  return metadataList
    .filter((meta) => {
      const isGlobalMap =
        (meta.chartType === "map" || meta.chartSubtype === "choropleth") &&
        meta.country === "GLB";

      const isMatchingCountry = meta.country === selectedCountry;

      const isMatchingType = !chartType || meta.chartType === chartType;
      const isMatchingCategory =
        !selectedCategory || meta.category === selectedCategory;

      return (isMatchingCountry || isGlobalMap) && isMatchingType && isMatchingCategory;
    })
    .map((meta) => {
      const match = charts.find(
        (d) =>
          String(d._id) === String(meta._id) ||
          String(d.metadataId) === String(meta._id)
      );

      return {
        metadata: meta,
        data: match?.data || [],
      };
    });
}, [metadataList, charts, selectedCountry, selectedCategory, chartType]);


   

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Country-Based Chart Explorer"
        subtitle="Select a country and explore its data"
      />

      <Typography variant="subtitle1" gutterBottom>
        Click a country on the map to see available charts
      </Typography>

      <ChoroplethMapComponent
        geoJson={worldGeoJson}
        regionValues={regionValues}
        onCountryClick={handleCountryClick}
      />

      {selectedCountry && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Charts for {countries.getName(selectedCountry, "en") || selectedCountry}
          </Typography>

          <Grid container spacing={2} alignItems="center" mt={1} mb={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
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
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="area">Area</MenuItem>
                  <MenuItem value="pie">Pie</MenuItem>
                  <MenuItem value="combo">Combo</MenuItem>
                  <MenuItem value="map">Map</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/charts/create")}
              >
                Upload Chart Data
              </Button>
            </Grid>
          </Grid>

          {filteredCharts.length > 0 && (
            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={exportAllChartsToPDF}
            >
              Export All Charts to PDF
            </Button>
          )}

          {selectedCategory ? (
            loadingMeta || isFetching ? (
              <Box mt={4} display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : filteredCharts.length > 0 ? (
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(600px, 1fr))"
                gap={4}
                ref={chartsRef}
              >
                {filteredCharts.map(({ metadata, data }) => (
                  <ChartPreview
                    key={metadata._id}
                    chartType={metadata.chartType}
                    data={data}
                    metadata={metadata}
                  />
                ))}
              </Box>
            ) : (
              <Typography mt={4}>
                No charts found for selected criteria.
              </Typography>
            )
          ) : (
            <Typography mt={4} color="text.secondary">
              Please select a category to view charts for{" "}
              {countries.getName(selectedCountry, "en") || selectedCountry}.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ChartExplorer;
// This code is a React component for a chart explorer that allows users to view and filter charts based on country, category, and chart type. It includes a choropleth map for selecting countries and displays charts in a grid format. Users can also export all charts to a PDF file.
// It uses Material-UI for styling and layout, and integrates with a Redux API slice to fetch chart metadata and data. The component handles loading states and displays appropriate messages when no charts are found or when data is being fetched.