import React, { useRef } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { getChartColors } from 'utils/chartColors';
import useChartKeys from 'hooks/useChartKeys';

import LineChartComponent from 'components/chartsView/LineChartComponent';
import BarChartComponent from 'components/chartsView/BarChartComponent';
import PieChartComponent from 'components/chartsView/PieChartComponent';
import AreaChartComponent from 'components/chartsView/AreaChartComponent';
import ComboChartComponent from 'components/chartsView/ComboChartComponent';

const ChartPreview = ({ chartType = 'line', data = [], metadata = {} }) => {
  const colors = getChartColors(metadata.category);
  const chartRef = useRef();
  const { xKey, yKeys } = useChartKeys(data);

  const exportToPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.text(metadata.title || 'Chart Export', 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 190, 100);
    pdf.save(`${metadata.title || 'chart'}.pdf`);
  };

  const renderChart = () => {
    const chartProps = {
      title: metadata.title,
      data,
      xKey,
      colors,
    };

    switch (chartType) {
      case 'line':
        return <LineChartComponent {...chartProps} lineKeys={yKeys} />;
      case 'bar':
        return <BarChartComponent {...chartProps} barKeys={yKeys} />;
      case 'pie':
        return <PieChartComponent {...chartProps} dataKey={yKeys[0]} nameKey={xKey} />;
      case 'area':
        return <AreaChartComponent {...chartProps} areaKeys={yKeys} />;
      case 'combo':
        return <ComboChartComponent {...chartProps} comboKeys={yKeys} />;
      default:
        return <Typography color="error">Unsupported chart type: {chartType}</Typography>;
    }
  };

  return (
    <Box p={3} border="1px solid #ccc" borderRadius="8px" bgcolor="#fff">
      <Box ref={chartRef}>
        <Typography variant="h5" gutterBottom>
          {metadata?.name || metadata?.title || 'Untitled Chart'}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Category: {metadata?.category} — Type: {chartType}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {renderChart()}
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
