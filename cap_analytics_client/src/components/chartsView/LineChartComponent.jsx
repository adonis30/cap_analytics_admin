import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const LineChartComponent = ({ data, metadata }) => {
  if (!data || data.length === 0) return <p>No data to display</p>;

  // Choose keys dynamically or hard-code based on schema
  const xKey = Object.keys(data[0])[0];  // e.g. 'year'
  const yKeys = Object.keys(data[0]).filter((key) => key !== xKey);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {yKeys.map((key) => (
          <Line type="monotone" dataKey={key} stroke="#8884d8" key={key} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
