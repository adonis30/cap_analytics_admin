import React, { useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDeleteChartDataMutation } from "state/api"; // ✅ Import mutation

import { generateColors } from "utils/generateColors";
import useChartKeys from "hooks/useChartKeys";

import LineChartComponent from "components/chartsView/LineChartComponent";
import BarChartComponent from "components/chartsView/BarChartComponent";
import PieChartComponent from "components/chartsView/PieChartComponent";
import AreaChartComponent from "components/chartsView/AreaChartComponent";
import ComboChartComponent from "components/chartsView/ComboChartComponent";
import ChoroplethMapComponent from "components/chartsView/ChoroplethMapComponent";
import worldGeoJson from "utils/world-geo.json";

const formatLabelKey = (key) =>
  key?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ChartPreview = ({ chartType = "line", data = [], metadata = {}, refetch }) => {
  const chartRef = useRef();
  const { xKey, yKeys } = useChartKeys(data);
  const [deleteChart, { isLoading: deleting }] = useDeleteChartDataMutation(); // ✅ Mutation

  const primaryKey = yKeys?.[0] || "market_size_usd_";

  const colors =
    chartType === "pie"
      ? generateColors(data.length)
      : generateColors(yKeys.length);

  const sortedData = useMemo(() => {
    if (!xKey) return data;
    return [...data].sort((a, b) => new Date(a[xKey]) - new Date(b[xKey]));
  }, [data, xKey]);

  const regionValues = useMemo(() => {
    if (chartType !== "choropleth" && chartType !== "map") return {};
    const result = {};
    data.forEach((entry) => {
      const iso = entry.country?.toUpperCase();
      const val = entry[primaryKey];
      if (iso && typeof val === "number") result[iso] = val;
    });
    return result;
  }, [chartType, data, primaryKey]);

  // ✅ Export as PDF
  const exportToPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.text(metadata.name || "Chart Export", 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 190, 100);
    pdf.save(`${metadata.title || "chart"}.pdf`);
  };

  // ✅ Delete chart handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this chart?")) return;

    try {
      await deleteChart(metadata._id).unwrap();
      alert("Chart deleted successfully ✅");
      if (refetch) refetch(); // 🔄 Refresh chart list if provided
    } catch (err) {
      alert("Failed to delete chart ❌");
      console.error(err);
    }
  };

  const renderChart = () => {
    const chartProps = { data: sortedData, xKey, colors };

    switch (chartType) {
      case "line":
        return <LineChartComponent {...chartProps} lineKeys={yKeys} />;
      case "bar":
        return <BarChartComponent {...chartProps} barKeys={yKeys} />;
      case "pie":
        return <PieChartComponent {...chartProps} dataKey={yKeys[0]} nameKey={xKey} />;
      case "area":
        return <AreaChartComponent {...chartProps} areaKeys={yKeys} />;
      case "combo":
        return <ComboChartComponent {...chartProps} comboKeys={yKeys} />;
      case "choropleth":
      case "map":
        return (
          <ChoroplethMapComponent
            geoJson={worldGeoJson}
            regionValues={regionValues}
            dataKey={primaryKey}
          />
        );
      default:
        return <Typography color="error">Unsupported chart type: {chartType}</Typography>;
    }
  };

  return (
    <Box mb={4} p={3} border="1px solid #ccc" borderRadius="8px">
      <Box ref={chartRef}>
        <Typography variant="h6" gutterBottom>
          {metadata?.name || metadata?.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {metadata?.category} — Type: {chartType}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {renderChart()}

        {chartType !== "pie" && chartType !== "choropleth" && chartType !== "map" && (
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {yKeys.map((key, idx) => (
              <Chip
                key={key}
                label={formatLabelKey(key)}
                sx={{
                  backgroundColor: colors[idx % colors.length],
                  color: "#fff",
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* ✅ Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button onClick={exportToPDF} variant="outlined" size="small">
          Export as PDF
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          size="small"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ChartPreview;
