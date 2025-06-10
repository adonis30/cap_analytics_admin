import React, { useRef, useMemo } from 'react';
import { Box, Typography, Button, Divider, Stack, Chip } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { generateColors } from 'utils/generateColors';
import useChartKeys from 'hooks/useChartKeys';

import LineChartComponent from 'components/chartsView/LineChartComponent';
import BarChartComponent from 'components/chartsView/BarChartComponent';
import PieChartComponent from 'components/chartsView/PieChartComponent';
import AreaChartComponent from 'components/chartsView/AreaChartComponent';
import ComboChartComponent from 'components/chartsView/ComboChartComponent';

// Helper to format keys like month_year into readable labels
const formatLabelKey = (key) => {
  if (!key || typeof key !== 'string') return key;
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const ChartPreview = ({ chartType = 'line', data = [], metadata = {} }) => {
  const chartRef = useRef();
  const { xKey, yKeys } = useChartKeys(data);

  const colors =
    chartType === 'pie'
      ? generateColors(data.length)
      : generateColors(yKeys.length);

  // 🔁 Ensure data is sorted by xKey (especially for years)
  const sortedData = useMemo(() => {
    if (!xKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[xKey];
      const bVal = b[xKey];

      // Handle ISO strings or month-year formatting
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return new Date(aVal) - new Date(bVal);
      }

      // Handle numeric year
      if (!isNaN(aVal) && !isNaN(bVal)) {
        return Number(aVal) - Number(bVal);
      }

      return 0;
    });
  }, [data, xKey]);

  const exportToPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.text(metadata.name || 'Chart Export', 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 190, 100);
    pdf.save(`${metadata.title || 'chart'}.pdf`);
  };

  const renderChart = () => {
    const chartProps = {
      data: sortedData,
      xKey,
      colors,
    };

    switch (chartType) {
      case 'line':
        return <LineChartComponent {...chartProps} lineKeys={yKeys} />;
      case 'bar':
        return <BarChartComponent {...chartProps} barKeys={yKeys} />;
      case 'pie':
        if (!yKeys.length) {
          return <Typography color="error">Missing pie chart data key</Typography>;
        }
        return (
          <PieChartComponent
            {...chartProps}
            dataKey={yKeys[0]}
            nameKey={xKey}
          />
        );
      case 'area':
        return <AreaChartComponent {...chartProps} areaKeys={yKeys} />;
      case 'combo':
        return <ComboChartComponent {...chartProps} comboKeys={yKeys} />;
      default:
        return <Typography color="error">Unsupported chart type: {chartType}</Typography>;
    }
  };

  const renderLegend = () => {
    if (chartType === 'pie') return null;

    return (
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
        {yKeys.map((key, idx) => (
          <Chip
            key={key}
            label={formatLabelKey(key)}
            sx={{
              backgroundColor: colors[idx % colors.length],
              color: '#fff',
              fontWeight: 500,
            }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box p={3} border="1px solid #ccc" borderRadius="8px">
      <Box ref={chartRef}>
        <Typography variant="h5" gutterBottom>
          {metadata?.name || metadata?.title || 'Untitled Chart'}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          {metadata?.category || 'Uncategorized'} — Type: {chartType}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {renderChart()}
        {renderLegend()}
      </Box>

      <Button
        onClick={exportToPDF}
        sx={{ mt: 2 }}
        variant="outlined"
        size="small"
      >
        Export as PDF
      </Button>
    </Box>
  );
};

export default ChartPreview;
