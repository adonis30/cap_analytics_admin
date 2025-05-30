import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatLabelKey } from 'utils/formatLabelKey';

const BarChartComponent = ({ title, data, xKey, barKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} tickFormatter={formatLabelKey} />
      <YAxis />
      <Tooltip formatter={(value, name) => [value, formatLabelKey(name)]} />
      <Legend formatter={formatLabelKey} />
      {barKeys.map((key, i) => (
        <Bar key={key} dataKey={key} fill={colors[i % colors.length]} name={formatLabelKey(key)} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartComponent;
