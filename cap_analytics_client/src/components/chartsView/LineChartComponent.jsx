// components/chartsView/LineChartComponent.jsx
import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

const LineChartComponent = ({ title, data, xKey, lineKeys }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lineKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke="#8884d8" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
