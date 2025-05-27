import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const ChartPreview = ({ data, xKey, yKey, chartType }) => {
  if (!data || !xKey || !yKey) {
    return <Typography>Chart parameters missing or invalid.</Typography>;
  }

  const ChartComponent = chartType === "bar" ? BarChart : LineChart;
  const ChartElement = chartType === "bar" ? (
    <Bar dataKey={yKey} fill="#1976d2" />
  ) : (
    <Line type="monotone" dataKey={yKey} stroke="#1976d2" />
  );

  return (
    <Paper elevation={3} style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h6" gutterBottom>
        Preview: {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {ChartElement}
        </ChartComponent>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ChartPreview;
