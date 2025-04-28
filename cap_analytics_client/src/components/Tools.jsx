import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  useDeletesdgFocusMutation, 
  useDeleteSectorMutation, 
  useDeleteTicketSizeMutation 
} from "state/api";

const Tools = ({ data = [], type, loading }) => {
  const navigate = useNavigate();

  const [deleteSector] = useDeleteSectorMutation();
  const [deleteTicket] = useDeleteTicketSizeMutation();
  const [deleteSdgFocus] = useDeletesdgFocusMutation();

  const columns = [
    {
      field: "mainField", // Dynamic field
      headerName: type === "ticketsize" ? "Amount" : "Name",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 400,
    },
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

  const handleEdit = (id) => {
    navigate(`/tools/update/${type}/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (type === "sector") {
          await deleteSector(id).unwrap();
        } else if (type === "ticketsize") {
          await deleteTicket(id).unwrap();
        } else if (type === "sdgfocus") {
          await deleteSdgFocus(id).unwrap();
        }
        alert(`${type} deleted successfully`);
      } catch (error) {
        alert(`Failed to delete ${type}. ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
        rows={data.map((item) => ({
          id: item._id || item.id,
          mainField: type === "ticketsize" ? item.number : item.name,
          description: item.description || "N/A",
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
        checkboxSelection
      />
    </div>
  );
};

export default Tools;
