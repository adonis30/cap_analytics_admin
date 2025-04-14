import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Container,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
  cardActionAreaClasses,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { UploadDropzone } from "@uploadthing/react"; // Import Uploadthing's dropzone
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetCategoriesQuery,
  useGetFundingTypesQuery,
  useGetFundingRoundsQuery,
  useGetFundingInstrumentsQuery,
  useCreateCategoryMutation,
  useCreateFundingTypeMutation,
  useCreateFundingRoundMutation,
  useCreateFundingInstrumentMutation,
  useInitiateUploadMutation,
  useGetCompanyByIdQuery,
} from "state/api";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "./MultiSelectDropdown";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  organizationName: yup.string().required("Company name is required"),
  description: yup.string().required("Description is required"),
  industries: yup
    .array()
    .of(yup.string())
    .required("Industry type is required"),
  categories: yup
    .array()
    .of(yup.string())
    .required("At least one category is required"),
  fundingTypes: yup
    .array()
    .of(yup.string())
    .required("At least one funding type is required"),
  fundingRounds: yup
    .array()
    .of(yup.string())
    .required("At least one funding round is required"),
  fundingInstruments: yup
    .array()
    .of(yup.string())
    .required("At least one funding instrument is required"),
  contactNumber: yup.string(),
  contactEmail: yup.string().email("Invalid email format"),
  imageUrl: yup.string().nullable(),

  operatingStatus: yup
    .string()
    .oneOf(["Active", "Inactive", "Closed"])
    .default("Active"),
  location: yup.string().required("Company location is required"),
  fundedDate: yup.date().nullable().required("Funded Date is required"), // ✅ Date validation
  owners: yup.string().required("Owners are required"),
  url: yup.string().url("Must be a valid URL"),
});

const CompaniesForm = ({ company, companyId }) => {
  const {
    data: company1,
    isLoading,
    error,
  } = useGetCompanyByIdQuery(companyId);

  const navigate = useNavigate();

  // Fetch data from APIs
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: fundingRoundsData, isLoading: fundingRoundsLoading } =
    useGetFundingRoundsQuery();
  const { data: fundingTypesData, isLoading: fundingTypesLoading } =
    useGetFundingTypesQuery();

  const { data: fundingInstrumentsData, isLoading: fundingInstrumentsLoading } =
    useGetFundingInstrumentsQuery();

  const [initiateUpload] = useInitiateUploadMutation();

  const [createCategory] = useCreateCategoryMutation();
  const [createFundingType] = useCreateFundingTypeMutation();
  const [createFundingRound] = useCreateFundingRoundMutation();
  const [createFundingInstrument] = useCreateFundingInstrumentMutation();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();

  const formMode = companyId && company ? "update" : "create";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const defaultValues = {
    organizationName: company?.organizationName || "",
    description: company?.description || "",
    industries: company?.industries || [],
    location: company?.location || "",
    contactNumber: company?.contactNumber || "",
    contactEmail: company?.contactEmail || "",
    fundedDate: company?.fundedDate || null,
    imageUrl: company?.imageUrl || "",
    categories: company?.categories || [],
    fundingTypes: company?.fundingTypes || [],
    fundingRounds: company?.fundingRounds || [],
    fundingInstruments: company?.fundingInstruments || [],
    operatingStatus: company?.operatingStatus || "Active",
    owners: company?.owners || "",
    url: company?.url || "",
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  });

  // Set default values for the form

  useEffect(() => {
    if (formMode === "update" && company1) {
      const {
        organizationName,
        description,
        contactNumber,
        contactEmail,
        location,
        url,
        imageUrl,
        fundedDate,
        categories,
        fundingRounds,
        fundingTypes,
        fundingInstruments,
        owners,
        operatingStatus,
      } = company1;

      reset({
        organizationName,
        description,
        contactNumber,
        contactEmail,
        location,
        url,
        owners,
        operatingStatus,
        industries: company1?.industries || [], // Assuming industries is an array
        imageUrl: imageUrl ?? "", // for validation purposes
        fundedDate: fundedDate ? new Date(fundedDate) : null,
        categories: (categories ?? []).map((c) =>
          typeof c === "string" ? c : c._id
        ),
        fundingRounds: fundingRounds ?? [],
        fundingTypes: fundingTypes ?? [],
        fundingInstruments: fundingInstruments ?? [],
      });

      // Also show image preview if available
      if (imageUrl) {
        setPreviewUrl(imageUrl);
      }
    }
  }, [formMode, company1, reset]);

  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Watch selected dropdown values
  const selectedCategories = watch("categories");
  const selectedFundingTypes = watch("fundingTypes");
  const selectedIndustries = watch("industries");
  const selectedFundingRounds = watch("fundingRounds");
  const selectedFundingInstruments = watch("fundingInstruments");

  // ✅ Handle Adding New Values Dynamically
  const handleAddOption = async (createFn, inputValue, optionType) => {
    try {
      const newOption = await createFn({ name: inputValue }).unwrap();
      toast.success(`${optionType} added successfully!`);
      return { value: newOption.id, label: newOption.name };
    } catch (error) {
      toast.error(`Failed to add ${optionType}`);
      return null;
    }
  };

  const fundingRoundOptions =
    Array.isArray(fundingRoundsData?.fundingRounds) &&
    fundingRoundsData.fundingRounds.length > 0
      ? fundingRoundsData.fundingRounds.map((fr) => ({
          value: fr._id,
          label: fr.name,
        }))
      : [];

  const categoryOptions =
    Array.isArray(categoriesData?.categories) &&
    categoriesData.categories.length > 0
      ? categoriesData.categories.map((c) => ({
          value: c._id,
          label: c.name,
        }))
      : [];

  const getDefaultMultiSelectValues = (selected = [], options = []) => {
    if (!Array.isArray(selected)) return [];

    const selectedIds = selected
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "value" in item)
          return item.value;
        return null;
      })
      .filter(Boolean); // Remove nulls and undefined

    return options.filter((opt) => selectedIds.includes(String(opt.value)));
  };

  const fundingTypeOptions = useMemo(() => {
    return (
      fundingTypesData?.map((ft) => ({
        value: ft._id,
        label: ft.name,
      })) ?? []
    );
  }, [fundingTypesData]);

  const selectedFundingTypeValues = useMemo(() => {
    return getDefaultMultiSelectValues(
      watch("fundingTypes"),
      fundingTypeOptions
    );
  }, [watch("fundingTypes"), fundingTypeOptions]);

  const handleDropdownChange = (values, key) => {
    if (!Array.isArray(values)) return;
    const selectedIds = values
      .map((v) => (typeof v === "string" ? v : v?.value))
      .filter(Boolean);
    setValue(key, selectedIds, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    const selectedIds = watch("categories").map((c) =>
      typeof c === "string" ? c : c.value
    );
    const optionIds = categoryOptions.map((opt) => opt.value);

    const matched = categoryOptions.filter((opt) =>
      selectedIds.includes(String(opt.value))
    );
  }, [watch("categories"), categoryOptions]);

  // Watch selected categories and update industries in the background
  useEffect(() => {
    setValue("industries", selectedCategories); // Sync selectedCategories to industries without rendering
    console.log(
      "Selected categories updated in industries field:",
      selectedCategories
    );
  }, [selectedCategories, setValue]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // ✅ Set imageUrl in form state for validation
      setValue("imageUrl", file.name || "uploaded-file", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  console.log("Form errors:", errors);
  toast.error(error);
  const onSubmit = async (values) => {
    setIsSubmitting(true);

    // Validate image file before proceeding
    if (!selectedFile) {
      toast.error("Please upload an image.");
      setIsSubmitting(false);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      setIsSubmitting(false);
      return;
    }
    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      toast.error("Unsupported file format. Please upload JPG, JPEG, or PNG.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload the image first before creating the company
      if (selectedFile) {
        const formData = new FormData();
        formData.append("imageUrl", selectedFile);
        const uploadResponse = await initiateUpload(formData).unwrap();

        // Adjust based on your response structure:
        if (uploadResponse && uploadResponse.url) {
          values.imageUrl = uploadResponse.url;
        } else {
          throw new Error("Unexpected upload response structure");
        }
      }

      // Proceed with creating or updating the company
      if (formMode === "create") {
        const response = await createCompany({ company: values }).unwrap();
        console.log("Create Company Response:", response);
        toast.success("Company created successfully!");
      } else {
        if (!companyId) {
          toast.error("Missing company ID for update");
          return;
        }
        const response = await updateCompany({
          companyId,
          company: values,
        }).unwrap();

        toast.success("Company updated successfully!");
      }

      navigate("/companies");
    } catch (error) {
      if (error.response) {
        toast.error(`Server Error: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
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
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {formMode === "update" ? "Update Company" : "Create Company"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company Name"
                {...register("organizationName")}
                error={!!errors.organizationName}
                helperText={errors.organizationName?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              {categoriesData.length > 0 ? (
                <MultiSelectDropdown
                  options={
                    categoriesData?.map((c) => ({
                      value: c._id,
                      label: c.name,
                    })) ?? []
                  }
                  defaultValue={selectedCategories ?? []}
                  onChange={(values) =>
                    handleDropdownChange(values, "categories")
                  }
                  placeholder="Select Categories"
                  createOption={(inputValue) =>
                    handleAddOption(createCategory, inputValue, "Category")
                  }
                />
              ) : (
                <Typography>Loading categories...</Typography> // Or a loading spinner
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company email"
                {...register("contactEmail")}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            {/* Upload Button and Image Preview */}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company Location"
                {...register("location")}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <MultiSelectDropdown
                options={fundingTypeOptions}
                defaultValue={selectedFundingTypes}
                onChange={(values) =>
                  handleDropdownChange(values, "fundingTypes")
                }
                placeholder="Select Funding Types"
                createOption={(inputValue) =>
                  handleAddOption(createFundingType, inputValue, "Funding Type")
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {fundingRoundOptions.length > 0 ? (
                <MultiSelectDropdown
                  options={fundingRoundOptions}
                  defaultValue={selectedFundingRounds ?? []}
                  onChange={(values) =>
                    handleDropdownChange(values, "fundingRounds")
                  }
                  placeholder="Select funding rounds"
                  createOption={(inputValue) =>
                    handleAddOption(
                      createFundingRound,
                      inputValue,
                      "Funding Round"
                    )
                  }
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
                defaultValue={selectedFundingInstruments ?? []}
                onChange={(values) =>
                  handleDropdownChange(values, "fundingInstruments")
                }
                placeholder="Select Funding Instruments"
                createOption={(inputValue) =>
                  handleAddOption(
                    createFundingInstrument,
                    inputValue,
                    "Funding Instrument"
                  )
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Contact Number"
                {...register("contactNumber")}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
                defaultValue={company?.contactNumber || ""}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company Website"
                {...register("url")}
                error={!!errors.url}
                helperText={errors.url?.message}
                defaultValue={company?.url || ""}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Owners"
                {...register("owners")}
                error={!!errors.owners}
                helperText={errors.owners?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="fundedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Founded Date"
                      value={
                        company1?.fundedDate ? dayjs(company1.fundedDate) : null
                      }
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.fundedDate,
                          helperText: errors.fundedDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Operating Status"
                {...register("operatingStatus")}
                error={!!errors.operatingStatus}
                helperText={errors.operatingStatus?.message}
                defaultValue={company?.operatingStatus || "Active"}
              >
                {["Active", "Inactive", "Closed"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

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
                    ? "Update Company"
                    : "Create Company"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CompaniesForm;
