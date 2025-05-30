// components/chartsView/AreaChartComponent.jsx
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography, Box } from '@mui/material';

const AreaChartComponent = ({ title, data, xKey, areaKeys, colors = [] }) => {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {areaKeys.map((key, index) => (
            <Area 
            key={key} 
            type="monotone" 
            dataKey={key} 
            stackId="1" 
            stroke={colors[index % colors.length]}
            strokeWidth={2}
             />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AreaChartComponent;
