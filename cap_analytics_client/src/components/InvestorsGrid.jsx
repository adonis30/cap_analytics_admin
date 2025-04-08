import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useGetInvestorsQuery } from "state/api";
import { useTheme } from "@mui/material";

const InvestorsGrid = () => {
  const theme = useTheme();
  // Fetch investors data using RTK Query
  const { data: investors = [], isLoading, error } = useGetInvestorsQuery();
   
  const columns = [
    { field: "name", headerName: "Investor Name", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    { field: "totalAmountFunded", headerName: "Total Funded", width: 180 },
    { field: "highestAmountFunded", headerName: "Highest Funded", width: 180 },
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
    console.log("Edit investor ID:", id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this investor?")) {
      try {
        await fetch(`/api/investors/${id}`, { method: "DELETE" });
      } catch (error) {
        console.error("Error deleting investor:", error);
      }
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading data: {error.message}</div>}
      <DataGrid
        rows={investors.map((investor) => ({
          id: investor._id,
          name: investor.name,
          type: investor.type,
          description: investor.individualDetails?.bio || investor.institutionDetails?.description,
          email: investor.email,
          phoneNumber: investor.phoneNumber,
          totalAmountFunded: investor.totalAmountFunded,
          highestAmountFunded: investor.highestAmountFunded,
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
