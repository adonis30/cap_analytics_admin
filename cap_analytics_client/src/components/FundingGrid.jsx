import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useDeleteFundingInstrumentMutation, useDeleteFundingRoundMutation, useDeleteFundingTypeMutation } from "state/api";

const FundingGrid = ({ data, type }) => {
  const theme = useTheme();

  const [deleteFundingTpes, {isLoading: isDeletingFundingTpes }] = useDeleteFundingTypeMutation();
  const [deleteFundingInstrument , {isLoading: isDeletingFundingInstruments}] = useDeleteFundingInstrumentMutation();

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleEdit(params.id)}>Edit</button>
          <button onClick={() => handleDelete(params.id)}>Delete</button>
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    console.log(`${type} Edit ID:`, id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`/api/v1/funding/${type}/${id}`, { method: "DELETE" });
      } catch (error) {
        console.error("Error deleting item:", error);
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
