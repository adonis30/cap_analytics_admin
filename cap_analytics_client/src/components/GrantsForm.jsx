import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useUpdateGrantsMutation,
  useCreateGrantsMutation,
} from "../state/api";
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  awardingOrg: yup.string().required("Awarding Organization is required"),
  orgURL: yup.string().url("Must be a valid URL").required("Grant URL is required"),
  amount: yup.string().required("Grant Amount is required"),
  eligibility: yup.string().required("Grant eligibility is required"),
  duration: yup.string().required("Grant duration is required"),
  expiredingDate: yup.string().required("Grant expiring date is required"),
});

const GrantsForm = ({ grant = null, grantId = null }) => {
  const navigate = useNavigate();
  const formMode = grantId ? "update" : "create";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createGrant] = useCreateGrantsMutation();
  const [updateGrant] = useUpdateGrantsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: grant || {},
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await createGrant(data).unwrap();
      } else {
        await updateGrant({ id: grantId, ...data }).unwrap();
      }
      navigate("/grants");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={6}>
        <Typography variant="h5" mb={3}>
          {formMode === "update" ? "Update Grant" : "Create Grant"}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Grant Title"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Awarding Organization"
                fullWidth
                {...register("awardingOrg")}
                error={!!errors.awardingOrg}
                helperText={errors.awardingOrg?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Grant URL"
                fullWidth
                {...register("orgURL")}
                error={!!errors.orgURL}
                helperText={errors.orgURL?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                fullWidth
                {...register("amount")}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Eligibility"
                fullWidth
                {...register("eligibility")}
                error={!!errors.eligibility}
                helperText={errors.eligibility?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Duration"
                fullWidth
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Expiring Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("expiredingDate")}
                error={!!errors.expiredingDate}
                helperText={errors.expiredingDate?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                >
                  {formMode === "create" ? "Create Grant" : "Update Grant"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
    </Box>
  );
};

export default GrantsForm;
