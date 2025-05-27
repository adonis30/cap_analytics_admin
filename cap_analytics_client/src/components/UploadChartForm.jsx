import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useUploadChartDataMutation } from 'state/api';

const UploadChartForm = () => {
  const [file, setFile] = useState(null);
  const [uploadChartData, { isLoading, isSuccess, isError, error }] = useUploadChartDataMutation();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadChartData(formData).unwrap();
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Upload Chart Data
      </Typography>
      <Stack spacing={2}>
        <Button
          component="label"
          variant="contained"
          startIcon={<UploadFileIcon />}
        >
          Choose File
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {file && <Typography variant="body2">Selected: {file.name}</Typography>}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || isLoading}
        >
          Upload
        </Button>

        {isLoading && <LinearProgress />}
        {isSuccess && <Alert severity="success">Upload successful!</Alert>}
        {isError && (
          <Alert severity="error">
            {error?.data?.error || 'Upload failed. Please try again.'}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default UploadChartForm;
