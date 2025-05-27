// components/chartsView/PieChartComponent.jsx
import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Typography } from '@mui/material';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

const PieChartComponent = ({ title, data, dataKey = 'value', nameKey = 'label' }) => {
  // 1. Transform time-series data into categorical pie data
  // E.g., [{ year: 2020, investment: 100, gdp: 200 }] => [{ label: "investment", value: 100 }, ...]
  const transformed =
    data && data.length > 0
      ? Object.entries(data[data.length - 1]) // use latest year
          .filter(([key]) => key !== 'year' && key !== '_id' && key !== 'metadataId' && key !== '__v')
          .map(([key, val]) => ({ label: key, value: Number(val) }))
      : [];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <Typography variant="subtitle1" gutterBottom>{title} - (Pie View)</Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={transformed}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {transformed.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
