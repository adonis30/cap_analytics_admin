import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { formatLabelKey } from 'utils/formatLabelKey';
import { formatValue } from 'utils/formatValue';

const PieChartComponent = ({ title, data, dataKey, nameKey, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name, value }) =>
          `${formatLabelKey(name)}: ${formatValue(value, {
            prefix: "$",
            notation: "compact",
            currency: true,
          })}`
        }
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
          />
        ))}
      </Pie>
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
      <Legend
        formatter={formatLabelKey}
      />
    </PieChart>
  </ResponsiveContainer>
);

export default PieChartComponent;
