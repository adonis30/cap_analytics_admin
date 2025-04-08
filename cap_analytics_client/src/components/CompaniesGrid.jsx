import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTheme, Button, CircularProgress, Box, Typography } from "@mui/material";
import { useGetCompaniesQuery, useUpdateCompanyMutation, useDeleteCompanyMutation } from "state/api";

const CompaniesGrid = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Fetch the companies data
  const { data: companies = [], isLoading, error } = useGetCompaniesQuery();
  
  // Use RTK Query mutations for delete and update
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation(); 

  const handleEdit = (id) => {
    console.log("Editing company ID:", id);
    navigate(`/companies/update/${id}`); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(id).unwrap();
        console.log("Company deleted successfully");
      } catch (error) {
        console.error("Error deleting company:", error);
        alert("Failed to delete the company.");
      }
    }
  };

  const columns = [
    { field: "organizationName", headerName: "Organization", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "industries", headerName: "Industry", width: 200 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "contactEmail", headerName: "Contact Email", width: 250 },
    { field: "fundedDate", headerName: "Funded Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" size="small" onClick={() => handleEdit(params.id)}>
            Edit
          </Button>
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(params.id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error loading data: {error.message}</Typography>}
      <DataGrid
        rows={companies.map((company) => ({
          id: company._id, // Ensures correct ID mapping
          organizationName: company.organizationName,
          description: company.description,
          industries: Array.isArray(company.industries) 
            ? company.industries.join(", ")  // Safely join if it's an array
            : company.industries || "N/A", // If it's not an array, display 'N/A' or the value as is
          location: company.location,
          contactEmail: company.contactEmail,
          fundedDate: company.fundedDate
            ? new Date(company.fundedDate).toLocaleDateString()
            : "N/A",
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        loading={isLoading || isDeleting}  // Show loading while fetching or deleting
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default CompaniesGrid;
