import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import GrantsGrid from 'components/GrantsGrid';
import { useGetAllGrantsQuery } from 'state/api';


 const Grants = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data, isLoading } = useGetAllGrantsQuery();

    if (isLoading) {
        return <div> loading....</div>
    }


    return (
        <Box m="1.5rem 2.5rem">
           <Header title="Grants" subtitle="List of all Grants" />

           <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/grants/create')}
            >
                Create New 
                Grants
            </Button>

           </Box>
          <GrantsGrid grants={data} />
        </Box>
    )
 }

 export default Grants;