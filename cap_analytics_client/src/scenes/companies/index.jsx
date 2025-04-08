import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import { useGetCompaniesQuery } from 'state/api';
import CompaniesGrid from 'components/CompaniesGrid';

const Companies = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCompaniesQuery();
  
  if (isLoading) {
    return <div>Loading...</div>; // Optional: Show a loading indicator while the data is being fetched
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Companies" subtitle="List of all companies" />
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/companies/create')}
        >
          Create New Company
        </Button>
      </Box>
       
      <CompaniesGrid companies={data} />
    </Box>
  );
};

export default Companies;
