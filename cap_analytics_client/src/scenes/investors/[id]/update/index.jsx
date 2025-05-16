import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress} from '@mui/material';
import { useGetInvestorByIdQuery } from 'state/api';
import CreateInvestorForm from 'components/CreateInvestorForm';

function EditInvestor() {
  const { id } = useParams();
  const { data: investor, isLoading} = useGetInvestorByIdQuery(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  

  return (
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <CreateInvestorForm
        type="update"
        investor={investor}         
        investorId={id}
        //userId={investor.userId ?? ""}
      />
    </div>
  );
}

export default EditInvestor;
