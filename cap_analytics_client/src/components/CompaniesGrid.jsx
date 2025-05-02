import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  useTheme,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import {
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useGetSectorQuery,
} from "state/api";

const CompaniesGrid = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: companies = [], isLoading, error } = useGetCompaniesQuery();
  const { data: sectorsData = [] } = useGetSectorQuery();

  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();

  // 🧠 Map sector ID to name
  const sectorMap = useMemo(() => {
    const list = Array.isArray(sectorsData?.sector)
      ? sectorsData.sector
      : sectorsData;
    return list.reduce((acc, sector) => {
      acc[sector._id] = sector.name;
      return acc;
    }, {});
  }, [sectorsData]);

  const handleEdit = (id) => {
    navigate(`/companies/update/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(id).unwrap();
        alert("Company deleted successfully");
      } catch (error) {
        alert("Failed to delete the company: " + error.message);
      }
    }
  };

  const columns = [
    { field: "organizationName", headerName: "Organization", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "sectors", headerName: "Sectors", width: 250 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "contactEmail", headerName: "Contact Email", width: 250 },
    { field: "fundedDate", headerName: "Founded Date", width: 150 },
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
      {error && (
        <Typography color="error">Error loading data: {error.message}</Typography>
      )}
      <DataGrid
        rows={companies.map((company) => {
          const sectorNames = Array.isArray(company.sector)
            ? company.sector
                .map((sectorId) => sectorMap[sectorId] || `Unknown (${sectorId})`)
                .join(", ")
            : "N/A";

          return {
            id: company._id,
            organizationName: company.organizationName,
            description: company.description,
            sectors: sectorNames,
            location: company.location,
            contactEmail: company.contactEmail,
            fundedDate: company.fundedDate
              ? new Date(company.fundedDate).toLocaleDateString()
              : "N/A",
          };
        })}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        loading={isLoading || isDeleting}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default CompaniesGrid;
