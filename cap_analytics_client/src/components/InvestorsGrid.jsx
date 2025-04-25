import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { 
  useGetInvestorsQuery,
  useUpdateInvestorMutation,
  useDeleteInvestorMutation 
} from "state/api";
import {
  useTheme,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const InvestorsGrid = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Fetch investors data using RTK Query
  const { data: investors = [], isLoading, error } = useGetInvestorsQuery();

  const [ deleteInvestor, { isLoading: isDeleting } ] = useDeleteInvestorMutation();
   

  const handleEdit = (id) => {
    // Navigate to the edit page for the selected investor
    navigate(`/investors/update/${id}`); // Navigate to the edit page
  } ;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this investor?")) {
      try {
        await deleteInvestor(id).unwrap(); // Use RTK Query to delete the investor
        alert("Investor deleted successfully");
      } catch (error) {
        
        alert("Failed to delete the investor.", error.message);
      }
    }
  }

  const columns = [
    { field: "name", headerName: "Investor Name", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    { field: "totalAmountFunded", headerName: "Total Funded", width: 180 },
    { field: "sectors", headerName: "sectors", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(params.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Check if data is loading or if there's an error
  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">Error loading data: {error.message}</Typography>;
  }


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading data: {error.message}</div>}
      <DataGrid
        rows={investors.map((investor) => ({
          id: investor._id,
          name: investor.name,
          type: investor.type,
          description:
            investor.individualDetails?.bio ||
            investor.institutionDetails?.description,
          email: investor.email,
          phoneNumber: investor.phoneNumber,
          totalAmountFunded: investor.totalAmountFunded,
          sectors: investor.sectors,
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        loading={isLoading}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default InvestorsGrid;
