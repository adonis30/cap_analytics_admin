import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import { useGetInvestorsQuery } from 'state/api';
import InvestorsGrid from 'components/InvestorsGrid';

const Investors = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, isLoading } = useGetInvestorsQuery();
  
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Investors" subtitle="List of all investors" />
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/investors/create')}
        >
          Create New Investor
        </Button>
      </Box>
      
      <InvestorsGrid investors={data} />
    </Box>
  );
};

export default Investors;
