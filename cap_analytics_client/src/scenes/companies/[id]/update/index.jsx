import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useGetCompanyByIdQuery, useUpdateCompanyMutation } from "state/api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CompanyForm from "components/CompaniesForm";
const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: company, isLoading, error } = useGetCompanyByIdQuery(id);
  console.log(company);
  const [updateCompany, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyMutation();

  const [formData, setFormData] = useState({
    organizationName: "",
    description: "",
    industries: "",
    location: "",
    contactNumber: "",
    contactEmail: "",
    fundedDate: "",
    imageUrl: "",
    categoryIds: [],
    fundingTypeIds: [],
    fundingRoundsIds: [],
    fundingInstruments: [],
  });

  useEffect(() => {
    if (company) {
      

      setFormData({
        organizationName: company.organizationName || "",
        description: company.description || "",
        industries: Array.isArray(company.industries)
          ? company.industries.join(", ")
          : company.industries || "",
        location: company.location || "",
        contactNumber: company.contactNumber || "",
        contactEmail: company.contactEmail || "",
        fundedDate: company.fundedDate
          ? new Date(company.fundedDate).toISOString().split("T")[0]
          : "",
        imageUrl: company.imageUrl || "",
        categoryIds: company.categories?.map((cat) => cat._id) || [],
        fundingTypeIds: company.fundingTypes?.map((ft) => ft._id) || [],
        fundingRoundsIds: company.fundingRounds?.map((fr) => fr._id) || [],
        fundingInstruments: company.fundingInstruments?.map((fi)=> fi._id) || [],
        industries: company.industries?.map((ind) => ind.name).join(", ") || "",
      });
    }
  }, [company]);
 

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
 

   
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Company details</h1>
      <CompanyForm 
       type="Update"
       company={formData}
       companyId={id}
       userId={company.userId}
       
      />
    </div>
    </LocalizationProvider>
  );
};

export default EditCompany;
