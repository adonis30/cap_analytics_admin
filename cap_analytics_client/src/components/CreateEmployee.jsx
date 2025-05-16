import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  MenuItem,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useInitiateUploadMutation,
  useGetCompaniesQuery,
  useGetInvestorsQuery,
} from "state/api";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumbers: yup.string().required("Phone number is required"),
  organizationId: yup.string().required("Organization is required"),
  position: yup.string().required("Position is required"),
  department: yup.string().nullable(),
  hireDate: yup.date().nullable(),
  address: yup.string(),
  linkedInUrl: yup.string().url().nullable(),
  photoUrl: yup.string().nullable(),
  bio: yup.string().nullable(),
});

const EmployeeForm = ({ employee = null, employeeId = null }) => {
  const navigate = useNavigate();
  const formMode = employeeId ? "update" : "create";
  const fileInputRef = useRef();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [initiateUpload] = useInitiateUploadMutation();
  const { data: companiesData = [] } = useGetCompaniesQuery();
  const { data: investorsData = [] } = useGetInvestorsQuery();

  const organizationOptions = [
    ...(companiesData || []).map((company) => ({
      label: `Company: ${company.organizationName}`,
      value: company._id,
    })),
    ...(investorsData || []).map((investor) => ({
      label: `Investor: ${investor.name}`,
      value: investor._id,
    })),
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumbers: "",
      organizationId: "",
      position: "",
      department: "",
      hireDate: null,
      address: "",
      linkedInUrl: "",
      photoUrl: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (formMode === "update" && employee) {
      const formatted = {
        ...employee,
        hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
      };
      reset(formatted);
      if (employee.photoUrl) {
        setPreviewUrl(employee.photoUrl);
      }
    }
  }, [employee, formMode, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("imageUrl", selectedFile);

        const { url } = await initiateUpload(imageData).unwrap();
        formData.photoUrl = url;
      }

      if (formMode === "create") {
        await createEmployee({ data: formData }).unwrap();
        alert("Employee created");
      } else {
        await updateEmployee({ employeeId, data: formData }).unwrap();
        alert("Employee updated");
      }

      navigate("/employees");
    } catch (err) {
      alert(`Error: ${err?.message || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {formMode === "create" ? "Create Employee" : "Edit Employee"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="First Name"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register("phoneNumbers")}
                error={!!errors.phoneNumbers}
                helperText={errors.phoneNumbers?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="organizationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Select Organization"
                    {...field}
                    value={field.value || ""} // Ensure a fallback value
                    error={!!errors.organizationId}
                    helperText={errors.organizationId?.message}
                  >
                    {organizationOptions.map((org) => (
                      <MenuItem key={org.value} value={org.value}>
                        {org.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                {...register("position")}
                error={!!errors.position}
                helperText={errors.position?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                {...register("department")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  control={control}
                  name="hireDate"
                  render={({ field }) => (
                    <DatePicker
                      label="Hire Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.hireDate,
                          helperText: errors.hireDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                {...register("linkedInUrl")}
                error={!!errors.linkedInUrl}
                helperText={errors.linkedInUrl?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                {...register("address")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                {...register("bio")}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                hidden
              />
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current.click()}
              >
                Upload Photo
              </Button>
              {previewUrl && (
                <Card sx={{ mt: 2, maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={previewUrl}
                    alt="Employee Image"
                  />
                </Card>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : formMode === "create"
                    ? "Create Employee"
                    : "Update Employee"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;
