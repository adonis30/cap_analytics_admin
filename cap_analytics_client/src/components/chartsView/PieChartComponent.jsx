import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PieChartComponent = ({ title, data = [], dataKey, nameKey, colors = [] }) => {
  if (!dataKey || !nameKey) {
    return <div style={{ color: 'red' }}>Invalid pie chart configuration: missing keys.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4>{title}</h4>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length] || '#8884d8'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
