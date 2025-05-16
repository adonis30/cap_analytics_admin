import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";
import {
  useGetEmployeesQuery,
  useGetCompaniesQuery,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetInvestorsQuery,
} from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { CircularProgress, Typography } from "@mui/material";
 

const EmployeesGrid = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const { data: companiesData = [] } = useGetCompaniesQuery();
  const { data: investorsData = [] } = useGetInvestorsQuery();

  const organizationMap = useMemo(() => {
    const all = [
      ...(Array.isArray(companiesData?.company)
        ? companiesData.company
        : companiesData),
      ...(Array.isArray(investorsData?.investor)
        ? investorsData.investor
        : investorsData),
    ];

    return all.reduce((acc, org) => {
      acc[org._id] = org.organizationName || org.name || "Unnamed Org";
      return acc;
    }, {});
  }, [companiesData, investorsData]);

  const handleEdit = (id) => {
    navigate(`/employees/update/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id).unwrap();
        alert("Employee deleted successfully");
      } catch (error) {
        alert("Failed to delete the employee: " + error.message);
      }
    }
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      width: 200,
       valueGetter: (value, row) => {
      return `${row.firstName || ''} ${row.lastName || ''}`;
    },
    },

    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phoneNumbers",
      headerName: "Phone Number",
      width: 200,
    },
    {
    field: "organization", // virtual field
    headerName: "Organization",
    width: 200,
    valueGetter: (value, row) => {
       
       return organizationMap[row.organizationId] || "—";
    },
  },

    {
      field: "position",
      headerName: "Position",
      width: 200,
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
    },
    {
      field: "hireDate",
      headerName: "Hire Date",
      width: 180,
        valueGetter: (value, row) => {
            return new Date(row.hireDate).toLocaleDateString("en-US");
        },
    },
    {
      field: "linkedInUrl",
      headerName: "LinkedIn",
      width: 200,
      renderCell: (params) =>
        params?.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a0dab" }}
          >
            View Profile
          </a>
        ) : (
          "—"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row._id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      {isLoading ? (
        <div>Loading...</div> // Optional: Show a loading indicator while the data is being fetched
      ) : (
        <Box>
          <DataGrid
            rows={employees?.data || []}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            autoHeight
          />
        </Box>
      )}
      {error && (
        <Typography color="error">
          Error loading data: {error.message}
        </Typography>
      )}
      {isDeleting && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default EmployeesGrid;
