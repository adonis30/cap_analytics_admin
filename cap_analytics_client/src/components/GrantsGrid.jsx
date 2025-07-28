import {
  useTheme,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { width } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  useGetAllGrantsQuery,
  useDeleteGrantMutation,
  useUpdateGrantsMutation,
} from "state/api";

const GrantsGrid = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: grants = [], isLoading, error } = useGetAllGrantsQuery();
  const [deleteGrant, { isLoading: isDeleting }] = useDeleteGrantMutation();
  const [updateGrant] = useUpdateGrantsMutation();

  const handleEdit = (id) => {
    navigate(`/grants/update/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this grant")) {
      try {
        await deleteGrant(id).unwrap();
        alert("Grant deleted successfully");
      } catch (error) {
        alert("Failed to delete the grant", error.message);
      }
    }
  };

  const columns = [
    { field: "title", headerName: "Grants title", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "eligibility", headerName: "Eligibility", width: 200},
    { field: "orgURL", headerName: "URL", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "expiredingDate", headerName: "Expiring Date", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
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
  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      {isLoading && <CircularProgress />}
      {error && (
        <Typography color="error">
          {" "}
          Error loading data: {error.message}
        </Typography>
      )}

      <DataGrid
        rows={grants.map((grant) => {
          return {
            id: grant._id,
            title: grant.title,
            description: grant.description,
            awardingOrg: grant.awardingOrg,
            orgURL: grant.orgURL,
            amount: grant.amount,
            eligibility: grant.eligibility,
            duration: grant.duration,
            expiredingDate: grant.expiredingDate
              ? new Date(grant.expiredingDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "N/A",
          };
        })}
        columns={columns}
        pageSize={10}
        rowPerPageOPtions={[10, 20, 50]}
        loading={isLoading || isDeleting}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default GrantsGrid;
