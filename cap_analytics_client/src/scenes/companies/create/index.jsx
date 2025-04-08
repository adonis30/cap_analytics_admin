"use client";

import CompanyForm from "components/CompaniesForm";
import { useNavigate } from "react-router-dom"; 
import { useCreateCompanyMutation } from "state/api";
import { toast } from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const [createCompany] = useCreateCompanyMutation();  // Example of a hook inside component

  const handleCreateCompany = async (data) => {
    try {
      const response = await createCompany(data);
      if (response?.success) {
        toast.success("Company created successfully!");
        navigate("/companies");
      } else {
        toast.error(response?.message || "Failed to create company.");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Company</h1>
      <CompanyForm onSubmit={handleCreateCompany} />
    </div>
    </LocalizationProvider>
  );
};

export default CreateCompanyPage;
