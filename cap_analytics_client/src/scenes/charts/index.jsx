import React, { useState } from 'react';
import { Box, Button, useTheme, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import ChartPreview from './ChartPreview';
import ChartSelector from 'components/ChartSelector';
import { useGetChartDataByMetadataIdQuery } from 'state/api';

const Charts = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedMetadataId, setSelectedMetadataId] = useState(null);

  const {
    data: chartPayload,
    isLoading: isLoadingChartData,
    error,
  } = useGetChartDataByMetadataIdQuery(selectedMetadataId, {
    skip: !selectedMetadataId,
  });
console.log('chartPayload', chartPayload);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Charts" subtitle="Dynamic chart rendering from uploaded data" />

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/charts/create')}
        >
          Upload Chart Data
        </Button>
      </Box>

      <ChartSelector onSelect={(id) => setSelectedMetadataId(id)} />

      {isLoadingChartData ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" mt={2}>
          Failed to load chart data.
        </Typography>
      ) : chartPayload?.data ? (
        <ChartPreview
          chartType="line" // Replace with dynamic value if needed
          data={chartPayload.data}
          metadata={chartPayload.metadata}
        />
      ) : (
        <Typography mt={4}>No chart selected.</Typography>
      )}
    </Box>
  );
};

export default Charts;
