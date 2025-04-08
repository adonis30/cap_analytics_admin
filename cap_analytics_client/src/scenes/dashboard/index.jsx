import React, { useEffect, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  DownloadOutlined,
  Business,
  AttachMoney,
  Category,
  GroupAdd,
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StatBox from "components/StatBox";
import { useNavigate } from "react-router-dom";
import {
  useGetInvestorsQuery,
  useGetCompaniesQuery,
  useGetFundingInstrumentsQuery,
  useGetFundingRoundsQuery,
  useGetFundingTypesQuery,
  useGetCategoriesQuery,
  useGetAllUsersQuery,
} from "state/api";

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  // Fetch data
  const { data: companies, isLoading: loadingCompanies } = useGetCompaniesQuery();
  const { data: fundingInstruments, isLoading: loadingFundingInstruments } = useGetFundingInstrumentsQuery();
  const { data: investors = [], isLoading:loadingInvestors, error } = useGetInvestorsQuery();
  const { data: fundingRoundings, isLoading: loadingFundingRoundings } = useGetFundingRoundsQuery();
  const { data: fundingTypes, isLoading: loadingFundingTypes } = useGetFundingTypesQuery();
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: users, isLoading: loadingUsers } = useGetAllUsersQuery();

  const [mappedCompanies, setMappedCompanies] = useState([]);

  useEffect(() => {
    if (companies && categories) {
      const categoriesMap = {};
      categories.forEach((category) => {
        categoriesMap[category._id] = category.name;
      });
  
      const mappedData = companies.map((company) => {
        const categoryNames = company.categories.map(
          (category) => 
            typeof category === "string" ? categoriesMap[category] || category 
            : category.name // If category is an object, use its name
        );
        return { ...company, categories: categoryNames };
      });
  
      setMappedCompanies(mappedData);
    }
  }, [companies, categories]);

  const companyColumns = [
    { field: "organizationName", headerName: "Company Name", flex: 1.5 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "categories",
      headerName: "Categories",
      flex: 1,
      renderCell: (params) => (params.value && Array.isArray(params.value)) ? params.value.join(", ") : "",
    },
  ];

  const fundingInstrumentColumns = [
     
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 1 },
  ];

  const columns = [
    { field: "name", headerName: "Investor Name", width: 200 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    { field: "totalAmountFunded", headerName: "Total Funded", width: 180 },
    { field: "highestAmountFunded", headerName: "Highest Funded", width: 180 },
    
  ];
  
  
  
  
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Manage Your Data" />
        <Box display="flex" gap="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/companies/create")}
          >
            Create Company
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/funding/create")}
          >
            Create Funding Instrument
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/funding/create")}
          >
            Create Funding Type
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/funding/create")}
          >
            Create Funding Round
          </Button>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* STATISTICS */}
        <StatBox
          title="Total Companies"
          loading={loadingCompanies}
          value={companies?.length || 0}
          description="Registered Companies"
          icon={
            <Business
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/companies")}
        />

        <StatBox
          title="Total Investors"
          loading={loadingInvestors}
          value={investors?.length || 0}
          description="Registered Investors"
          icon={
            <AttachMoney
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/investors")}
        />
        <StatBox
          title="Funding Instruments"
          loading={loadingFundingInstruments}
          value={fundingInstruments?.length || 0}
          description="Types of Funding Available"
          icon={
            <AccountTreeIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/fundings")}
        />

        <StatBox
          title="Funding Rounds"
          loading={loadingFundingRoundings}
          value={fundingRoundings?.fundingRounds?.length || 0}
          description="Types of Funding Available"
          icon={
            <Category
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/fundings")}
        />

        <StatBox
          title="Funding Types"
          loading={loadingFundingTypes}
          value={fundingTypes?.length || 0}
          description="Types of Funding Available"
          icon={
            <AccountBalanceIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/fundings")}
        />
        <StatBox
          title="Total users"
          loading={loadingUsers}
          value={users?.length || 0}
          description="Registered users"
          icon={
            <GroupAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
          onClick={() => navigate("/users")}
        />

        {/* COMPANIES TABLE */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          paddingBottom="2rem"
          sx={{ "& .MuiDataGrid-root": { borderRadius: "1.5rem" } }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.secondary[100] }}
          >
            Companies
          </Typography>
          <DataGrid
            loading={loadingCompanies}
            rows={mappedCompanies || []}
            columns={companyColumns}
            getRowId={(row) => row._id}
          />
        </Box>

        {/* FUNDING INSTRUMENTS TABLE */}
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.secondary[100] }}
          >
            Funding Instruments
          </Typography>
          <DataGrid
            loading={loadingFundingInstruments}
            rows={fundingInstruments || []}
            columns={fundingInstrumentColumns}
            getRowId={(row) => row._id}
          />
        </Box>

        {/* INVESTORS TABLE */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.secondary[100] }}
          >
            Investors
          </Typography>
          {loadingInvestors && <div>Loading...</div>}
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
                  loading={loadingInvestors}
                  checkboxSelection
                  disableSelectionOnClick
                />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
