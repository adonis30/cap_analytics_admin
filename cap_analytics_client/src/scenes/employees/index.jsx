import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, useTheme } from '@mui/material';
import Header from 'components/Header';
import { useGetEmployeesQuery } from 'state/api';
import EmployeesGrid from 'components/EmployeesGrid';

const Employees = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data, isLoading } = useGetEmployeesQuery();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Employees" subtitle="List of all employees" />
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/employees/create')}
              >
                Add New Employee
              </Button>
            </Box>
        
      {isLoading ? (
        <div>Loading...</div> // Optional: Show a loading indicator while the data is being fetched
      ) : (
        <Box>
            <EmployeesGrid employees={data} />
        </Box>
      )}
    </Box>
  )
}

export default Employees