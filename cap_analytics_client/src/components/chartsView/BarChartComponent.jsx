 
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, Typography, useTheme } from '@mui/material';

const BarChartComponent = ({ title, data, xKey, barKeys }) => {
  const theme = useTheme();

  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {barKeys.map((key, index) => (
              <Bar key={index} dataKey={key} fill={theme.palette.primary.main} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
