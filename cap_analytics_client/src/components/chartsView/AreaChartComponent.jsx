import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLabelKey } from 'utils/formatLabelKey';

const AreaChartComponent = ({ title, data, xKey, areaKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} tickFormatter={formatLabelKey} />
      <YAxis />
      <Tooltip formatter={(value, name) => [value, formatLabelKey(name)]} />
      <Legend formatter={formatLabelKey} />
      {areaKeys.map((key, i) => (
        <Area key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} name={formatLabelKey(key)} />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartComponent;
