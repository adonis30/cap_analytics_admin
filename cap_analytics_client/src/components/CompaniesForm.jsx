import { useState, useEffect, useRef, useMemo, useCallback, use } from "react";
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
  useGetsdgFocusQuery,
  useGetInvestmentAskQuery,
  useGetSectorQuery,
} from "state/api";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "./MultiSelectDropdown";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  organizationName: yup.string().required("Company name is required"),
  description: yup.string().required("Description is required"),
  sector: yup.array().of(yup.string()).required(),
  fundingRounds: yup.array().of(yup.string()).required(),
  fundingInstruments: yup.array().of(yup.string()).required(),
  contactNumber: yup.string(),
  contactEmail: yup.string().email("Invalid email format"),
  imageUrl: yup.string().nullable(),
  operatingStatus: yup
    .string()
    .oneOf(["Active", "Inactive", "Closed"])
    .default("Active"),
  location: yup.string().required("Company location is required"),
  fundedDate: yup.date().nullable().required("Funded Date is required"),
  owners: yup.string().required("Owners are required"),
  url: yup.string().url("Must be a valid URL"),

  // ✨ New fields
  investmentAsk: yup.string().nullable(),
  sdgFocus: yup.array().of(yup.string()).nullable(),
  businessGrowthStage: yup
    .string()
    .oneOf(["Idea", "Seed", "Early", "Growth", "Expansion", "Mature"])
    .nullable(),
  yearsInOperation: yup.number().nullable(),
  annualExpenditure: yup.number().nullable(),
  annualRevenue: yup.number().nullable(),
});

const CompaniesForm = ({ company, companyId }) => {
  const {
    data: company1,
    isLoading,
    error,
  } = useGetCompanyByIdQuery(companyId);

  const navigate = useNavigate();

  // Fetch data from APIs
   
  const { data: fundingRoundsData, isLoading: fundingRoundsLoading } =
    useGetFundingRoundsQuery();
  

  const { data: fundingInstrumentsData, isLoading: fundingInstrumentsLoading } =
    useGetFundingInstrumentsQuery();

  const { data: sdgFocusData, isLoading: sdgFocusLoading } =
    useGetsdgFocusQuery();

  const { data: investmentAskData = [] } = useGetInvestmentAskQuery();

  const { data: sectorsData = [] } = useGetSectorQuery();

   

  const [initiateUpload] = useInitiateUploadMutation();

   
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
    sector: company?.sector || [],
    location: company?.location || "",
    contactNumber: company?.contactNumber || "",
    contactEmail: company?.contactEmail || "",
    fundedDate: company?.fundedDate || null,
    imageUrl: company?.imageUrl || "",
    fundingRounds: company?.fundingRounds || [],
    fundingInstruments: company?.fundingInstruments || [],
    operatingStatus: company?.operatingStatus || "Active",
    owners: company?.owners || "",
    url: company?.url || "",
    investmentAsk: company?.investmentAsk || "",
    sdgFocus: company?.sdgFocus || [],
    businessGrowthStage: company?.businessGrowthStage || "",
    yearsInOperation: company?.yearsInOperation || null,
    annualExpenditure: company?.annualExpenditure || null,
    annualRevenue: company?.annualRevenue || null,
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
        fundingRounds,
        fundingTypes,
        fundingInstruments,
        owners,
        operatingStatus,
        sdgFocus,
        sector,
        investmentAsk,
        businessGrowthStage,
        yearsInOperation,
        annualExpenditure,
        annualRevenue,
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
        sector: company1?.sector || [], // Assuming industries is an array
        imageUrl: imageUrl ?? "", // for validation purposes
        fundedDate: fundedDate ? dayjs(fundedDate) : null,

        fundingRounds: fundingRounds ?? [],
        
        sdgFocus: (sdgFocus ?? []).map((s) =>
          typeof s === "string" ? s : s._id
        ),
        investmentAsk: investmentAsk || "",
        yearsInOperation: yearsInOperation ?? null,
        annualExpenditure: annualExpenditure ?? null,
        annualRevenue: annualRevenue ?? null,
        fundedDate: fundedDate ? dayjs(fundedDate) : null,
        businessGrowthStage: businessGrowthStage ?? "",

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
   
  const selectedFundingRounds = watch("fundingRounds");
  const selectedFundingInstruments = watch("fundingInstruments");
  const selectedSDGFocus = watch("sdgFocus");

  const investmentAskValue = watch("investmentAsk");
  const investmentAskValid = investmentAskData.some(
    (item) => item._id === investmentAskValue
  );

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

  

  const sdgFocusOptions =
    Array.isArray(sdgFocusData?.sdgFocus) && sdgFocusData.sdgFocus.length > 0
      ? sdgFocusData.sdgFocus.map((s) => ({
          value: s._id,
          label: s.name,
        }))
      : [];
      const selectedSectorsOptions =
      Array.isArray(sectorsData?.sectors) && sectorsData.sectors.length > 0
        ? sectorsData.sectors.map((s) => ({
            value: s._id,
            label: s.name,
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

  

  const investmentAskOptions =
    Array.isArray(investmentAskData) && investmentAskData.length > 0
      ? investmentAskData.map((ia) => ({
          value: ia._id,
          label: `${ia.min} - ${ia.max}`,
        }))
      : [];
   

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

 
  const onSubmit = async (values) => {
   
    setIsSubmitting(true);

    try {
      // ✅ CASE: New image is selected
      if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE) {
          toast.error("File is too large. Maximum size is 5MB.");
          setIsSubmitting(false);
          return;
        }

        if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
          toast.error(
            "Unsupported file format. Please upload JPG, JPEG, or PNG."
          );
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("imageUrl", selectedFile);

        const uploadResponse = await initiateUpload(formData).unwrap();
        if (uploadResponse?.url) {
          values.imageUrl = uploadResponse.url;
        } else {
          throw new Error("Unexpected upload response structure");
        }
      } else {
        // ✅ CASE: No new image selected – use existing one
        const currentImage = watch("imageUrl"); // already set from defaultValues
        if (!currentImage) {
          toast.error("Please upload an image.");
          setIsSubmitting(false);
          return;
        }
        values.imageUrl = currentImage;
      }

      // ✅ Create or Update company
      if (formMode === "create") {
        const response = await createCompany({ company: values }).unwrap();

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
      toast.error("Failed to create/update company");
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
            <MultiSelectDropdown
              options={
                selectedSectorsOptions.length > 0
                  ? selectedSectorsOptions
                  : (sectorsData?.map((s) => ({
                      value: s._id,
                      label: s.name,
                    })) ?? [])
              }
              defaultValue={watch("sector")}
              onChange={(values) => handleDropdownChange(values, "sector")}
              placeholder="Select Sectors"
            />
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
            {/* Investment Ask */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Investment Ask"
                value={investmentAskValid ? investmentAskValue : ""}
                {...register("investmentAsk")}
                error={!!errors.investmentAsk}
                helperText={errors.investmentAsk?.message}
              >
                {investmentAskOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Business Growth Stage */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Growth Stage"
                {...register("businessGrowthStage")}
                value={watch("businessGrowthStage") || ""} // guard against undefined
                error={!!errors.businessGrowthStage}
                helperText={errors.businessGrowthStage?.message}
              >
                {["Idea", "Seed", "Early", "Growth", "Expansion", "Mature"].map(
                  (stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/* SDG Focus */}
            <Grid item xs={12} md={4}>
              <MultiSelectDropdown
                options={[
                  ...(sdgFocusData?.map((s) => ({
                    value: s._id,
                    label: s.name,
                  })) ?? []),
                ]}
                defaultValue={watch("sdgFocus") || []}
                onChange={(values) => handleDropdownChange(values, "sdgFocus")}
                placeholder="Select SDG Focus Areas"
              />
            </Grid>

            {/* Years in Operation */}
            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                fullWidth
                label="Years in Operation"
                {...register("yearsInOperation")}
                error={!!errors.yearsInOperation}
                helperText={errors.yearsInOperation?.message}
              />
            </Grid>

            {/* Annual Expenditure */}
            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                fullWidth
                label="Annual Expenditure (USD)"
                {...register("annualExpenditure")}
                error={!!errors.annualExpenditure}
                helperText={errors.annualExpenditure?.message}
              />
            </Grid>

            {/* Annual Revenue */}
            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                fullWidth
                label="Annual Revenue (USD)"
                {...register("annualRevenue")}
                error={!!errors.annualRevenue}
                helperText={errors.annualRevenue?.message}
              />
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

            {/*  <Grid item xs={12} md={4}>
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
            </Grid> */}
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
                      value={field.value}
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
