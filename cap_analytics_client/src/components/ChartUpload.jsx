import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import ChartPreview from './ChartPreview';

const ChartUpload = () => {
  const [rawData, setRawData] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('line');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      setRawData(json);
      setXKey('');
      setYKey('');
    };
    reader.readAsBinaryString(file);
  };

  const keys = rawData.length > 0 ? Object.keys(rawData[0]) : [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Chart Data
      </Typography>

      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden accept=".xlsx, .csv" onChange={handleFileUpload} />
      </Button>

      {keys.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <TextField
            select
            label="X Axis"
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            sx={{ mr: 2, width: 200 }}
          >
            {keys.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Y Axis"
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            sx={{ mr: 2, width: 200 }}
          >
            {keys.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Chart Type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
          </TextField>
        </Box>
      )}

      {xKey && yKey && (
        <Box sx={{ mt: 4 }}>
          <ChartPreview data={rawData} xKey={xKey} yKey={yKey} chartType={chartType} />
        </Box>
      )}
    </Box>
  );
};

export default ChartUpload;
