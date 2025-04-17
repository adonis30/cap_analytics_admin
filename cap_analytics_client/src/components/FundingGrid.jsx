import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  useTheme,
  Button,
  Box,
 } from "@mui/material";
import { useDeleteFundingInstrumentMutation, useDeleteFundingRoundMutation, useDeleteFundingTypeMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const FundingGrid = ({ data, type }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [deleteFundingTpes, {isLoading: isDeletingFundingTpes }] = useDeleteFundingTypeMutation();
  const [deleteFundingInstrument , {isLoading: isDeletingFundingInstruments}] = useDeleteFundingInstrumentMutation();
  const [deleteFundingRound , {isLoading: isDeletingFundingRounds}] = useDeleteFundingRoundMutation();

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
              <Box display="flex" marginTop={1.5} gap={1}>
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

  const handleEdit = (id) => {
     
     navigate(`/fundings/update/${type}/${id}`); // Navigate to the edit page
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
       
      try {
        if (type === "FundingType") {
          await deleteFundingTpes(id).unwrap();
        } else if (type === "FundingInstrument") {
          await deleteFundingInstrument(id).unwrap();
        } else if (type === "FundingRound") {
          await deleteFundingRound(id).unwrap();
        }
        alert(`${type} deleted successfully`);
      } catch (error) {
        alert(`Failed to delete ${type}.`, error.message);
        
      }
    }
  };

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
        rows={data.map((item) => ({
          id: item._id || item.id,  // Ensure the ID field is correct
          name: item.name || "N/A",
          description: item.description || "N/A",
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default FundingGrid;
