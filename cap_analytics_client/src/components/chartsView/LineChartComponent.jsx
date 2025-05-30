import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Label
} from 'recharts';
import { Typography, Box } from '@mui/material';

// Utility to format field names
const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

const LineChartComponent = ({ title, data, xKey, lineKeys = [], colors = [] }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey}>
            <Label value={formatKey(xKey)} offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Rate (%)" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend />
          {lineKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={formatKey(key)}
              label={{ position: 'top', fill: '#555', fontSize: 12 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChartComponent;
