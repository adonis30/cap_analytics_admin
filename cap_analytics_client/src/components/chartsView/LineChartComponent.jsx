import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatLabelKey } from 'utils/formatLabelKey';

const LineChartComponent = ({ title, data, xKey, lineKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} tickFormatter={formatLabelKey} />
      <YAxis />
      <Tooltip formatter={(value, name) => [value, formatLabelKey(name)]} />
      <Legend formatter={formatLabelKey} />
      {lineKeys.map((key, i) => (
        <Line key={key} dataKey={key} stroke={colors[i % colors.length]} name={formatLabelKey(key)} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
