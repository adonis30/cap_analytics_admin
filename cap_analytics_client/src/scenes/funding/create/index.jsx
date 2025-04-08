import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    useGetFundingInstrumentsQuery,
    useGetFundingTypesQuery,
    useGetFundingRoundsQuery,
  } from "state/api";

// Reusable Form Component
const FundingForm = ({ title, apiEndpoint, tableData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(apiEndpoint, data);
      navigate("/fundings"); // Redirect to home or funding overview after creation
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Typography variant="h5" mb={3}>{title}</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register("description")}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create
        </Button>
      </form>

      {tableData && (
        <Box mt={5}>
          <Typography variant="h6" mb={2}>Existing {title}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => navigate(`/funding/${item.id}`)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};



// Create Instrument Component
export const CreateInstrument = () => {
  
   const { data: fundingInstruments, isLoading: loadingFundingInstruments } = useGetFundingInstrumentsQuery();
      
   
    // Show loading if any of the data is still being fetched
    if (loadingFundingInstruments ) {
      return <div>Loading...</div>;
    }
  
  return <FundingForm title="Create Funding Instrument" apiEndpoint="/api/funding-instruments" tableData={fundingInstruments} />;
};

// Create Type Component
export const CreateType = () => {
    
        const { data: fundingTypes, isLoading: loadingFundingTypes } = useGetFundingTypesQuery();
     
      // Show loading if any of the data is still being fetched
      if (
        
        loadingFundingTypes
      ) {
        return <div>Loading...</div>;
      }

  return <FundingForm title="Create Funding Type" apiEndpoint="/api/funding-types" tableData={fundingTypes} />;
};

// Create Round Component
export const CreateRound = () => {
  
      const { data: fundingRoundings, isLoading: loadingFundingRoundings } = useGetFundingRoundsQuery();
      
   
    // Show loading if any of the data is still being fetched
    if ( loadingFundingRoundings ) {
      return <div>Loading...</div>;
    }
  
  return <FundingForm title="Create Funding Round" apiEndpoint="/api/funding-rounds" tableData={fundingRoundings} />;
};
