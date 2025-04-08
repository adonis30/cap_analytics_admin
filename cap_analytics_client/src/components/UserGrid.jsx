import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UsersGrid = ({ users = [], onDelete }) => {
  const navigate = useNavigate();

  // Define columns for the DataGrid
  const columns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "username", headerName: "Username", width: 180 },
    { field: "role", headerName: "Role", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {/* Edit Button */}
          <IconButton
            color="primary"
            onClick={() => navigate(`/users/edit/${params.id}`)}
          >
            <EditIcon />
          </IconButton>

          {/* Delete Button */}
          <IconButton
            color="error"
            onClick={() => onDelete(params.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={users.map((user) => ({
          id: user._id, // DataGrid requires an 'id' field
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          role: user.role,
        }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default UsersGrid;
