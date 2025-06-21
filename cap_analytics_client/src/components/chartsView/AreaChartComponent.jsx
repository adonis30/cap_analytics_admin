import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { formatLabelKey } from 'utils/formatLabelKey';
import { formatValue } from 'utils/formatValue';

const AreaChartComponent = ({ title, data, xKey, areaKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} tickFormatter={formatLabelKey} />
      <YAxis />
      <Tooltip
        formatter={(value, name) => [
          formatValue(value, {
            prefix: "$",
            notation: "compact",
            currency: true,
          }),
          formatLabelKey(name),
        ]}
      />
      <Legend formatter={formatLabelKey} />
      {areaKeys.map((key, i) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colors[i % colors.length]}
          fill={colors[i % colors.length]}
          fillOpacity={0.3}
          name={formatLabelKey(key)}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartComponent;
