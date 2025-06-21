import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { formatLabelKey } from 'utils/formatLabelKey';
import { formatValue } from 'utils/formatValue';

const ComboChartComponent = ({ title, data, xKey, comboKeys, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
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
      {comboKeys.map((key, i) =>
        i % 2 === 0 ? (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[i % colors.length]}
            name={formatLabelKey(key)}
          />
        ) : (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            name={formatLabelKey(key)}
          />
        )
      )}
    </ComposedChart>
  </ResponsiveContainer>
);

export default ComboChartComponent;
