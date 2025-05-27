// src/scane/charts/ChartPreview.jsx
import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import LineChartComponent from "components/chartsView/LineChartComponent";
import BarChartComponent from "components/chartsView/BarChartComponent";
import PieChartComponent from "components/chartsView/PieChartComponent";

const ChartPreview = ({ data, metadata }) => {
  if (!data || data.length === 0) {
    return <Typography>No chart data available</Typography>;
  }

  const keys = Object.keys(data[0]);
  const xKey = keys.find((k) => k.toLowerCase().includes("year")) || keys[0];
  const valueKeys = keys.filter(
    (k) => k !== xKey && k !== "_id" && k !== "__v" && k !== "metadataId"
  );

  return (
    <Grid container spacing={4}>
      {valueKeys.map((key, index) => (
        <React.Fragment key={key}>
          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📈 Line Chart - {key}
              </Typography>
              <LineChartComponent
                title={`${metadata.title} - ${key}`}
                data={data}
                xKey={xKey}
                lineKeys={[key]} // Explicit array of data keys
              />
            </Paper>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Bar Chart - {key}
              </Typography>
              <BarChartComponent
                title={`${metadata.title} - ${key}`}
                data={data}
                xKey={xKey}
                barKeys={[key]}
              />
            </Paper>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🥧 Pie Chart - {key}
              </Typography>
              <PieChartComponent
                title={`${metadata.title} - ${key}`}
                data={data}
                dataKey={key}
                nameKey={xKey}
              />
            </Paper>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default ChartPreview;
