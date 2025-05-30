import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Label,
} from 'recharts';
import { Typography, Box } from '@mui/material';

const BarChartComponent = ({ title, data, xKey, barKeys = [], colors = [], xAxisLabel = '', yAxisLabel = '' }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey}>
            <Label value={xAxisLabel || xKey} offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value={yAxisLabel || 'Value'} angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend />
          {barKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              label={{ position: 'top', fill: '#333', fontSize: 12 }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartComponent;
