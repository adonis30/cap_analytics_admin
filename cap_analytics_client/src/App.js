import React, { useMemo, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Companies from "scenes/companies";
import CompanyForm from "scenes/companies/create";

import Investors from "scenes/investors";
import FundingOverview from "scenes/funding";
import Users from "scenes/users";
import {
  CreateInstrument,
  CreateType,
  CreateRound,
  EditInstrument,
  EditType,
  EditRound,
} from "scenes/funding/create";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "components/LoadingSpinner";
import EditCompany from "scenes/companies/[id]/update";
import CreateInvestorPage from "scenes/investors/create";
import EditInvestor from "scenes/investors/[id]/update";
import ToolsOverview from "scenes/tools";
import { CreateInvestmentAsk, CreateSdgFocus, CreateSector, CreateTicketSize, EditInvestmentAsk, EditSdgFocus, EditSector, EditTicketSize } from "scenes/tools/create";
import Employees from "scenes/employees";
import CreateEmployeePage from "scenes/employees/create";
import EditEmployee from "scenes/employees/[id]/update";
import ChartExplorer from 'scenes/charts/ChartExplorer';
import CreateCharts from "scenes/charts/create";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const mode = useSelector((state) => state.global?.mode || "light");
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  

  return (
    <div className="app">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route
              path="/signin"
              element={
                <RedirectAuthenticatedUser>
                  <SignIn />
                </RedirectAuthenticatedUser>
              }
            />

            <Route
              path="/signup"
              element={
                <RedirectAuthenticatedUser>
                  <SignUp />
                </RedirectAuthenticatedUser>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/create" element={<CompanyForm />} />
              <Route path="/companies/update/:id" element={<EditCompany />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/investors/create" element={<CreateInvestorPage />} />
              <Route path="/investors/update/:id" element={<EditInvestor />} />
              <Route path="/fundings" element={<FundingOverview />} />
              <Route path="/tools" element={<ToolsOverview />} />
              <Route path="/tools/create/sector" element={<CreateSector />} />
              <Route path="/tools/create/sdgfocus" element={<CreateSdgFocus />} />
              <Route path="/tools/create/ticketsize" element={<CreateTicketSize />} />
              <Route path="/tools/create/investmentask" element={<CreateInvestmentAsk />} />
              <Route path="/tools/update/investmentask" element={<EditInvestmentAsk />} />
              <Route path="/tools/update/sector/:id" element={<EditSector />} />
              <Route path="/tools/update/sdgfocus/:id" element={<EditSdgFocus />} />
              <Route path="/tools/update/ticketsize/:id" element={<EditTicketSize />} />

              <Route
                path="/fundings/create/FundingInstrument"element={<CreateInstrument />}
              />
              <Route path="/fundings/update/FundingInstrument/:id" element={<EditInstrument />} />
              <Route path="/fundings/create/FundingType" element={<CreateType />} />
              <Route path="/fundings/update/FundingType/:id" element={<EditType />} />
              <Route path="/fundings/create/FundingRound" element={<CreateRound />} />
              <Route path="/fundings/update/FundingRound/:id" element={<EditRound />} />
              <Route path="/employees" element={< Employees />} />
              <Route path="/employees/create" element={< CreateEmployeePage />} />
              <Route path="/employees/update/:id" element={<EditEmployee />} />
              <Route path="/charts" element={<ChartExplorer />} />
              <Route path="/charts/create" element={<CreateCharts />} />

              {/* Users route */}
              <Route path="/users" element={<Users />} />
            </Route>

            {/* Fallback to Sign In if route not found */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
