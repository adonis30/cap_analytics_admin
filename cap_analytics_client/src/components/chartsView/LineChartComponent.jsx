import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

import { formatLabelKey } from 'utils/formatLabelKey';
import { formatValue } from 'utils/formatValue';

const LineChartComponent = ({ title, data, xKey, lineKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} tickFormatter={formatLabelKey} />
      <YAxis />
      <Tooltip
        formatter={(value, name) => [
          formatValue(value, {
            prefix: "$",
            notation: "compact", // Optional: "standard", "scientific"
            currency: true, // Set false if not monetary
          }),
          formatLabelKey(name),
        ]}
      />
      <Legend formatter={formatLabelKey} />
      {lineKeys.map((key, i) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colors[i % colors.length]}
          dot={false}
          strokeWidth={2}
          name={formatLabelKey(key)}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
