import React from "react";
import { Box, Button, useTheme, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";

import {
  useGetFundingInstrumentsQuery,
  useGetFundingTypesQuery,
  useGetFundingRoundsQuery,
} from "state/api";
import FundingGrid from "components/FundingGrid"; // Grid for fundingGrid
const FundingOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
    const { data: fundingInstruments, isLoading: loadingFundingInstruments } = useGetFundingInstrumentsQuery();
    const { data: fundingRoundings, isLoading: loadingFundingRoundings } = useGetFundingRoundsQuery();
    const { data: fundingTypes, isLoading: loadingFundingTypes } = useGetFundingTypesQuery();
 
  // Show loading if any of the data is still being fetched
  if (
    loadingFundingInstruments ||
    loadingFundingRoundings ||
    loadingFundingTypes
  ) {
    return <div>Loading...</div>;
  }

  const handleCreate = (type) => {
    navigate(`/fundings/create/${type}`); // Navigates to the appropriate create page
  };
  return (
    <>
      {/* Funding Instruments */}
      <Box mb={4} m="1.5rem 2.5rem"> 
       <Header title="Fundings" subtitle="List of all Funding Types , Instruments and Rounds" mb={6} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Funding Instruments
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("instruments")}>
            Create Instrument
          </Button>
        </Box>
        <FundingGrid data={fundingInstruments} type="FundingInstrument" />
      </Box>

      {/* Funding Types */}
      <Box mb={4} m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Funding Types
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("FundingType")}>
            Create Type
          </Button>
        </Box>
        <FundingGrid data={fundingTypes} type="FundingType" />
      </Box>

      {/* Funding Rounds */}
      <Box mb={4} m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" gutterBottom>
            Funding Rounds
          </Typography>
          <Button variant="contained" color="primary" onClick={() => handleCreate("FundingRound")}>
            Create Round
          </Button>
        </Box>
        <FundingGrid data={fundingRoundings?.fundingRounds || []} type="FundingRound" />
      </Box>
    </>
  );
};

export default FundingOverview;