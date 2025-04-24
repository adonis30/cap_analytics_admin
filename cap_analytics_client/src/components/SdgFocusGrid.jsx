import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { useDeletesdgFocusMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const SdgFocusGrid = ({ data = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [deleteSdgFocus] = useDeletesdgFocusMutation();

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: ({ id }) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" size="small" onClick={() => navigate(`/sdgfocus/update/${id}`)}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={async () => {
              if (window.confirm("Delete this SDG focus?")) {
                await deleteSdgFocus(id).unwrap();
              }
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: theme.palette.background.alt,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default SdgFocusGrid;
