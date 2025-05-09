import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetSectorQuery,
  useGetsdgFocusQuery,
  useGetTicketSizeQuery,
  useCreateSectorMutation,
  useCreateTicketSizeMutation,
  useCreatesdgFocusMutation,
  useUpdateSectorMutation,
  useUpdateTicketSizeMutation,
  useUpdatesdgFocusMutation,
  useGetInvestmentAskQuery,
  useCreateInvestmentAskMutation,
  useUpdateInvestmentAskMutation,
} from "state/api";

const ToolsForm = ({
  title,
  apiFn,
  tableData,
  isUpdate = false,
  initialData = null,
  updateFn,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdate && initialData) {
      if (title === "Ticket Size" || title === "Investment Ask") {
        setValue("min", initialData.min);
        setValue("max", initialData.max);
      } else {
        setValue("name", initialData.name);
      }
      setValue("description", initialData.description);
    }
  }, [isUpdate, initialData, title, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isUpdate && updateFn && initialData?._id) {
        await updateFn({ id: initialData._id, data }).unwrap();
      } else {
        await apiFn(data).unwrap();
      }
      reset();
      navigate("/tools");
    } catch (error) {
      const errorMsg =
        error?.data?.message || error?.message || "Unknown error";
      alert(`Error ${isUpdate ? "updating" : "creating"} tool: ${errorMsg}`);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Typography variant="h5" mb={3}>
        {isUpdate ? `Update ${title}` : `Create ${title}`}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {title === "Ticket Size" || title === "Investment Ask" ? (
          <>
            <TextField
              label="Min Amount"
              fullWidth
              margin="normal"
              type="number"
              {...register("min", { required: "Minimum amount is required" })}
              error={!!errors.min}
              helperText={errors.min?.message}
            />

            <TextField
              label="Max Amount"
              fullWidth
              margin="normal"
              type="number"
              {...register("max", { required: "Maximum amount is required" })}
              error={!!errors.max}
              helperText={errors.max?.message}
            />
          </>
        ) : (
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register("description")}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isUpdate ? "Update" : "Create"}
        </Button>
      </form>

      {tableData && !isUpdate && (
        <Box mt={5}>
          <Typography variant="h6" mb={2}>
            Existing {title}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {title === "Ticket Size" || title === "Investment Ask"
                      ? "Amount"
                      : "Name"}
                  </TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item._id || item.id}>
                    <TableCell>
                      {title === "Ticket Size" || title === "Investment Ask"
                        ? `${item.min} - ${item.max}`
                        : item.name}
                    </TableCell>

                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

// ----------------------------------------
// 📍 Create Pages
// ----------------------------------------

export const CreateSector = () => {
  const { data: sectors, isLoading } = useGetSectorQuery();
  const [createSector] = useCreateSectorMutation();

  if (isLoading) return <div>Loading sectors...</div>;

  return <ToolsForm title="Sector" apiFn={createSector} tableData={sectors} />;
};

export const CreateSdgFocus = () => {
  const { data: sdgFocus, isLoading } = useGetsdgFocusQuery();
  const [createSdgFocus] = useCreatesdgFocusMutation();

  if (isLoading) return <div>Loading SDG Focus...</div>;

  return (
    <ToolsForm title="SDG Focus" apiFn={createSdgFocus} tableData={sdgFocus} />
  );
};

export const CreateTicketSize = () => {
  const { data: ticketSizes, isLoading } = useGetTicketSizeQuery();
  const [createTicketSize] = useCreateTicketSizeMutation();

  if (isLoading) return <div>Loading Ticket Sizes...</div>;

  return (
    <ToolsForm
      title="Ticket Size"
      apiFn={createTicketSize}
      tableData={ticketSizes}
    />
  );
};

// ----------------------------------------
// 📍 Edit Pages
// ----------------------------------------

export const EditSector = () => {
  const { id } = useParams();
  const { data: sectors = [] } = useGetSectorQuery();
  const [updateSector] = useUpdateSectorMutation();

  const sectorToEdit = sectors.find(
    (item) => item._id === id || item.id === id
  );

  if (!sectorToEdit) return <div>Loading sector...</div>;

  return (
    <ToolsForm
      title="Sector"
      isUpdate
      initialData={sectorToEdit}
      updateFn={updateSector}
    />
  );
};

export const EditSdgFocus = () => {
  const { id } = useParams();
  const { data: sdgFocusList = [] } = useGetsdgFocusQuery();
  const [updateSdgFocus] = useUpdatesdgFocusMutation();

  const sdgFocusToEdit = sdgFocusList.find(
    (item) => item._id === id || item.id === id
  );

  if (!sdgFocusToEdit) return <div>Loading SDG Focus...</div>;

  return (
    <ToolsForm
      title="SDG Focus"
      isUpdate
      initialData={sdgFocusToEdit}
      updateFn={updateSdgFocus}
    />
  );
};

export const EditTicketSize = () => {
  const { id } = useParams();
  const { data: ticketSizes = [] } = useGetTicketSizeQuery();
  const [updateTicketSize] = useUpdateTicketSizeMutation();

  const ticketSizeToEdit = ticketSizes.find(
    (item) => item._id === id || item.id === id
  );

  if (!ticketSizeToEdit) return <div>Loading Ticket Size...</div>;

  return (
    <ToolsForm
      title="Ticket Size"
      isUpdate
      initialData={ticketSizeToEdit}
      updateFn={updateTicketSize}
    />
  );
};

export const CreateInvestmentAsk = () => {
  const { data: investmentAsk, isLoading } = useGetInvestmentAskQuery();
  const [CreateInvestmentAsk] = useCreateInvestmentAskMutation();

  if (isLoading) return <div>Loading Ticket Sizes...</div>;

  return (
    <ToolsForm
      title="Investment Ask"
      apiFn={CreateInvestmentAsk}
      tableData={investmentAsk}
    />
  );
};

export const EditInvestmentAsk = () => {
  const { id } = useParams();
  const { data: investmentask = [] } = useGetInvestmentAskQuery();
  const [updateInvestmentAsk] = useUpdateInvestmentAskMutation();

  const investmentAskToEdit = investmentask.find(
    (item) => item._id === id || item.id === id
  );

  if (!investmentAskToEdit) return <div>Loading investmentAsk...</div>;

  return (
    <ToolsForm
      title="Investment Ask"
      isUpdate
      initialData={investmentAskToEdit}
      updateFn={updateInvestmentAsk}
    />
  );
};
