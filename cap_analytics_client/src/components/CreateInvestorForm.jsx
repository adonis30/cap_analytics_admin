import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Card,
  CardMedia,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useCreateInvestorMutation,
  useGetFundingInstrumentsQuery,
  useGetFundingRoundsQuery,
  useGetFundingTypesQuery,
  useGetInvestorByIdQuery,
  useInitiateUploadMutation,
  useUpdateInvestorMutation,
  useGetCategoriesQuery,
  useGetCompaniesQuery,
} from "state/api";
import { useNavigate } from "react-router-dom";

const individualInvestorCategories = [
  { value: "Angel Investor", label: "Angel Investor" },
  { value: "Retail Investor", label: "Retail Investor" },
  { value: "Solo VC", label: "Solo VC" },
];

const institutionInvestorCategories = [
  { value: "VC Firm", label: "VC Firm" },
  { value: "Private Equity", label: "Private Equity" },
  { value: "Bank", label: "Bank" },
  { value: "Hedge Fund", label: "Hedge Fund" },
  { value: "Pension Fund", label: "Pension Fund" },
  { value: "Sovereign Wealth Fund", label: "Sovereign Wealth Fund" },
  { value: "Family Office", label: "Family Office" },
  { value: "Corporate Venture Capital", label: "Corporate Venture Capital" },
];

// Yup schema
const schema = yup.object().shape({
  type: yup.string().oneOf(["Individual", "Institution"]).required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required(),
  totalAmountFunded: yup.number().required(),
  highestAmountFunded: yup.number().required(),
  investorCategory: yup.string().required("Investor category is required"),
  fundingTypes: yup.array().of(yup.string()),
  fundingRounds: yup.array().of(yup.string()),
  fundingInstruments: yup.array().of(yup.string()),
  fundedCompaniesIds: yup.array().of(yup.string()),

  individualDetails: yup
    .object({
      firstName: yup.string(),
      lastName: yup.string(),
      position: yup.string(),
      linkedInUrl: yup.string().url().nullable(),
      portfolioUrl: yup.string().url().nullable(),
      imageUrl: yup.string(),
      bio: yup.string(),
    })
    .when("type", {
      is: "Individual",
      then: (schema) =>
        schema.shape({
          firstName: yup.string().required("First name is required"),
          lastName: yup.string().required("Last name is required"),
          imageUrl: yup.string().required("Image URL is required"),
        }),
      otherwise: (schema) =>
        schema.shape({
          firstName: yup.string().nullable(),
          lastName: yup.string().nullable(),
          imageUrl: yup.string().nullable(),
        }),
    }),

  institutionDetails: yup
    .object({
      organizationName: yup.string(),
      description: yup.string(),
      website: yup.string().url().nullable(),
      contactNumber: yup.string(),
      address: yup.string(),
      categories: yup.array().of(yup.string()),
      contactEmail: yup.string().email().nullable(),
      location: yup.string(),
      imageUrl: yup.string(),
    })
    .when("type", {
      is: "Institution",
      then: (schema) =>
        schema.shape({
          organizationName: yup
            .string()
            .required("Organization name is required"),
          imageUrl: yup.string().required("Image URL is required"),
        }),
      otherwise: (schema) =>
        schema.shape({
          organizationName: yup.string().nullable(),
          imageUrl: yup.string().nullable(),
        }),
    }),
});

const CreateInvestorForm = ({ investor, investorId }) => {
  const {
    data: investorData,
    isLoading: investorLoading,
    error: investorError,
  } = useGetInvestorByIdQuery(investorId);

  const { data: fundingTypesData, isLoading: fundingTypesLoading } =
    useGetFundingTypesQuery();
  const { data: fundingRoundsData, isLoading: fundingRoundsLoading } =
    useGetFundingRoundsQuery();
  const { data: fundingInstrumentsData, isLoading: fundingInstrumentsLoading } =
    useGetFundingInstrumentsQuery();
  const { data: companiesData, isLoading: companiesLoading } =
    useGetCompaniesQuery(); // replace with correct query
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const navigate = useNavigate();

  const [initiateUpload] = useInitiateUploadMutation();

  const [createInvestor] = useCreateInvestorMutation();
  const [updateInvestor] = useUpdateInvestorMutation();

  const formMode = investorId && investorData ? "update" : "create";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "Individual",
      name: "",
      email: "",
      phoneNumber: "",
      investorCategory: "",
      totalAmountFunded: 0,
      highestAmountFunded: 0,
      fundingTypes: [],
      fundingRounds: [],
      fundingInstruments: [],
      fundedCompaniesIds: [],
      individualDetails: {},
      institutionDetails: {},
    },
  });

  useEffect(() => {
    if (formMode === "update" && investorData) {
      const {
        type,
        name,
        email,
        phoneNumber,
        totalAmountFunded,
        highestAmountFunded,
        fundingTypes,
        fundingRounds,
        fundingInstruments,
        fundedCompaniesIds,
        individualDetails,
        institutionDetails,
        investorCategory,
      } = investorData;

      const imageUrl =
        type === "Individual"
          ? individualDetails?.imageUrl
          : institutionDetails?.imageUrl;

      setPreviewUrl(imageUrl || null);

      reset({
        type: type || "Individual",
        name,
        email,
        phoneNumber,
        totalAmountFunded,
        highestAmountFunded,
        fundingTypes: fundingTypes?.map((ft) =>
          typeof ft === "string" ? ft : ft._id
        ),
        fundingRounds: fundingRounds?.map((fr) =>
          typeof fr === "string" ? fr : fr._id
        ),
        fundingInstruments: fundingInstruments?.map((fi) =>
          typeof fi === "string" ? fi : fi._id
        ),
        fundedCompaniesIds: fundedCompaniesIds?.map((c) =>
          typeof c === "string" ? c : c._id
        ),
        individualDetails: {
          ...individualDetails,
          imageUrl: individualDetails?.imageUrl || "",
        },
        institutionDetails: {
          ...institutionDetails,
          imageUrl: institutionDetails?.imageUrl || "",
        },
        investorCategory: investorCategory || "",
      });
    }
  }, [investorData, formMode, reset]);

  const investorType = watch("type") || investor?.type || "Individual";

  const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const selectedFundingTypes = watch("fundingTypes");
  const selectedFundingRounds = watch("fundingRounds");
  const selectedFundingInstruments = watch("fundingInstruments");
  const selectedInvestorCategory = watch("investorCategory");

  const fundingRoundOptions =
    Array.isArray(fundingRoundsData?.fundingRounds) &&
    fundingRoundsData.fundingRounds.length > 0
      ? fundingRoundsData.fundingRounds.map((fr) => ({
          value: fr._id,
          label: fr.name,
        }))
      : [];

  const fundingTypesOptions = useMemo(() => {
    return (fundingTypesData?.fundingTypes ?? []).map((ft) => ({
      value: ft._id,
      label: ft.name,
    }));
  }, [fundingTypesData]);

  const fundingInstrumentsOptions = useMemo(() => {
    return (fundingInstrumentsData?.fundingInstruments ?? []).map((fi) => ({
      value: fi._id,
      label: fi.name,
    }));
  }, [fundingInstrumentsData]);

  const getDefaultMultiSelectValues = (selected = [], options = []) => {
    if (!Array.isArray(selected)) return [];

    const selectedIds = selected
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "value" in item)
          return item.value;
        return null;
      })
      .filter(Boolean);
    return options.filter((option) => selectedIds.includes(option.value));
  };

  const fundingTypeOptions = useMemo(() => {
    return (
      fundingTypesData?.map((ft) => ({
        value: ft._id,
        label: ft.name,
      })) ?? []
    );
  }, [fundingTypesData]);

  const selectedFundingTypesOptions = useMemo(() => {
    return getDefaultMultiSelectValues(
      watch("fundingTypes"),
      fundingTypesOptions
    );
  }, [watch("fundingTypes"), fundingTypesOptions]);

  const handleDropdownChange = (values, key) => {
    if (!Array.isArray(values)) return;
    const selectedIds = values
      .map((v) => (typeof v === "string" ? v : v?.value))
      .filter(Boolean);
    setValue(key, selectedIds, { shouldValidate: true, shouldDirty: true });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // ✅ Correct function
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);

      const imageField =
        investorType === "Individual"
          ? "individualDetails.imageUrl"
          : "institutionDetails.imageUrl";

      setValue(imageField, file.name || "uploaded-file", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const categoryOptions =
    investorType === "Individual"
      ? individualInvestorCategories
      : institutionInvestorCategories;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 🧠 Determine which image field to update
      const imageField =
        data.type === "Individual"
          ? "individualDetails.imageUrl"
          : "institutionDetails.imageUrl";

      // 📦 Upload selected file if any
      if (selectedFile) {
        if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type)) {
          alert("Unsupported file type. Only JPEG or PNG allowed.");
          return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
          alert("Image too large. Must be < 5MB.");
          return;
        }

        const formData = new FormData();
        formData.append("imageUrl", selectedFile);

        const uploadResponse = await initiateUpload(formData).unwrap();
        const uploadedUrl = uploadResponse?.url;

        if (!uploadedUrl) {
          alert("Image upload failed.");
          return;
        }

        // ✅ Assign uploaded URL to the correct field
        if (data.type === "Individual") {
          data.individualDetails.imageUrl = uploadedUrl;
        } else {
          data.institutionDetails.imageUrl = uploadedUrl;
        }
      }

      // 🧹 Remove any unexpected root-level imageUrl field
      delete data.imageUrl;

      if (data.type === "Individual") {
        delete data.institutionDetails;
      } else {
        delete data.individualDetails;
      }

      // 🔄 API Submission
      const response =
        formMode === "create"
          ? await createInvestor(data).unwrap()
          : await updateInvestor({ id: investorId, data }).unwrap();

      // ✅ Handle successful submission
      if (response?.success || response?._id) {
        alert(
          `Investor ${formMode === "create" ? "created" : "updated"} successfully!`
        );
        navigate("/investors");
      } else {
        console.warn("API response did not return success flag:", response);
        alert("Submission might have failed. Check logs or try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        "An error occurred during submission. Please check your network or data."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    fundingRoundsLoading ||
    fundingTypesLoading ||
    categoriesLoading ||
    fundingInstrumentsLoading
  ) {
    // Show loader until all data is fetched
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
   
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {formMode === "update" ? "Update Investor" : "Create Investor"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Type"
              value={watch("type")} // ✅ use watch here
              {...register("type")}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Institution">Institution</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Investor Category"
              value={watch("investorCategory")} // ✅ ensure it's bound
              {...register("investorCategory")}
              error={!!errors.investorCategory}
              helperText={errors.investorCategory?.message}
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Investor email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Phone Number"
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Total Amount Funded"
              type="number"
              fullWidth
              {...register("totalAmountFunded")}
              error={!!errors.totalAmountFunded}
              helperText={errors.totalAmountFunded?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Highest Amount Funded"
              type="number"
              fullWidth
              {...register("highestAmountFunded")}
              error={!!errors.highestAmountFunded}
              helperText={errors.highestAmountFunded?.message}
            />
          </Grid>

          {/* Funding Selects */}
          <Grid item xs={12} md={4}>
            <MultiSelectDropdown
              options={fundingTypeOptions}
              defaultValue={selectedFundingTypes}
              onChange={(values) =>
                handleDropdownChange(values, "fundingTypes")
              }
              placeholder="Select Funding Types"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {fundingRoundOptions.length > 0 ? (
              <MultiSelectDropdown
                options={fundingRoundOptions}
                defaultValue={selectedFundingRounds}
                onChange={(values) =>
                  handleDropdownChange(values, "fundingRounds")
                }
                placeholder="Select funding rounds"
              />
            ) : (
              <Typography>Loading funding rounds...</Typography> // Or a loading spinner
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <MultiSelectDropdown
              options={
                fundingInstrumentsData?.map((fi) => ({
                  value: fi._id,
                  label: fi.name,
                })) ?? []
              }
              defaultValue={selectedFundingInstruments}
              onChange={(values) =>
                handleDropdownChange(values, "fundingInstruments")
              }
              placeholder="Select Funding Instruments"
            />
          </Grid>

          {/* Individual Fields */}
          {investorType === "Individual" && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  label="First Name"
                  fullWidth
                  {...register("individualDetails.firstName")}
                  error={!!errors?.individualDetails?.firstName}
                  helperText={errors?.individualDetails?.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Last Name"
                  fullWidth
                  {...register("individualDetails.lastName")}
                  error={!!errors?.individualDetails?.lastName}
                  helperText={errors?.individualDetails?.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Position"
                  fullWidth
                  {...register("individualDetails.position")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="LinkedIn URL"
                  fullWidth
                  {...register("individualDetails.linkedInUrl")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Portfolio URL"
                  fullWidth
                  {...register("individualDetails.portfolioUrl")}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Image
                </Button>
                {previewUrl && (
                  <Card sx={{ mt: 2, maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      alt="Preview"
                      height="140"
                      image={previewUrl}
                    />
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("individualDetails.bio")}
                />
              </Grid>
            </>
          )}

          {/* Institution Fields */}
          {investorType === "Institution" && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Organization Name"
                  fullWidth
                  {...register("institutionDetails.organizationName")}
                  error={!!errors?.institutionDetails?.organizationName}
                  helperText={
                    errors?.institutionDetails?.organizationName?.message
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Website"
                  fullWidth
                  {...register("institutionDetails.website")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Contact Number"
                  fullWidth
                  {...register("institutionDetails.contactNumber")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Address"
                  fullWidth
                  {...register("institutionDetails.address")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Location"
                  fullWidth
                  {...register("institutionDetails.location")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Contact Email"
                  fullWidth
                  {...register("institutionDetails.contactEmail")}
                />
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Image
                </Button>
                {/* {errors.imageUrl && (
                <Typography color="error">{errors.imageUrl.message}</Typography>
              )} */}
                {previewUrl && (
                  <Card sx={{ mt: 2, maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={previewUrl}
                      alt="Selected"
                    />
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("institutionDetails.description")}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? formMode === "update"
                  ? "Updating..."
                  : "Creating..."
                : formMode === "update"
                  ? "Update Investor"
                  : "Create Investor"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateInvestorForm;
