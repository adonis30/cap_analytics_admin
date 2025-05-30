import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis,
  YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';

const ComboChartComponent = ({ title, data = [], xKey, comboKeys = [], colors = [] }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />

          {(comboKeys || []).map((key, idx) =>
            idx % 2 === 0 ? (
              <Bar key={key} dataKey={key} fill={colors[idx % colors.length] || '#8884d8'} />
            ) : (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length] || '#82ca9d'} />
            )
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComboChartComponent;
