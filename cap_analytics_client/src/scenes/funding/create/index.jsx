import React, { useEffect} from "react";
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
  Paper
} from "@mui/material";
import { useForm, } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  useGetFundingInstrumentsQuery,
  useGetFundingTypesQuery,
  useGetFundingRoundsQuery,
  useCreateFundingInstrumentMutation,
  useCreateFundingTypeMutation,
  useCreateFundingRoundMutation,
  useUpdateFundingInstrumentMutation,
  useUpdateFundingTypeMutation, 
  useUpdateFundingRoundMutation,
} from "state/api";

// ✅ Reusable Form Component
const FundingForm = ({ 
  title, 
  apiFn, 
  tableData, 
  isUpdate = false, 
  initialData = null, 
  updateFn 
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const navigate = useNavigate();

  // 🔁 Set form values if editing
  useEffect(() => {
    if (isUpdate && initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description);
    }
  }, [isUpdate, initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isUpdate && updateFn && initialData?._id) {
        await updateFn({ id: initialData._id, data }).unwrap();
      } else {
        await apiFn(data).unwrap();
      }
      reset();
      navigate("/fundings");
    } catch (error) {
      alert(`Error ${isUpdate ? "updating" : "creating"} funding: ${error.message}`);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Typography variant="h5" mb={3}>
        {isUpdate ? `Update ${title}` : `Create ${title}`}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
          <Typography variant="h6" mb={2}>Existing {title}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow key={item._id || item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/funding/edit/${item._id || item.id}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
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

// ✅ Create Instrument Component
export const CreateInstrument = () => {
  const { data: fundingInstruments, isLoading } = useGetFundingInstrumentsQuery();
  const [createFundingInstrument] = useCreateFundingInstrumentMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <FundingForm
      title="Create Funding Instrument"
      apiFn={createFundingInstrument}
      tableData={fundingInstruments}
    />
  );
};

// ✅ Create Type Component
export const CreateType = () => {
  const { data: fundingTypes, isLoading } = useGetFundingTypesQuery();
  const [createFundingType] = useCreateFundingTypeMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <FundingForm
      title="Create Funding Type"
      apiFn={createFundingType}
      tableData={fundingTypes}
    />
  );
};

// ✅ Create Round Component
export const CreateRound = () => {
  const { data: fundingRounds, isLoading } = useGetFundingRoundsQuery();
  const [createFundingRound] = useCreateFundingRoundMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <FundingForm
      title="Create Funding Round"
      apiFn={createFundingRound}
      tableData={fundingRounds}
    />
  );
};

 export const EditInstrument = () => {
  const { id } = useParams();
  const { data: instruments = [] } = useGetFundingInstrumentsQuery();
  const [updateFundingInstrument] = useUpdateFundingInstrumentMutation();

  const instrumentToEdit = instruments.find(item => item._id === id || item.id === id);

  if (!instrumentToEdit) return <div>Loading instrument...</div>;

  return (
    <FundingForm
      title="Funding Instrument"
      isUpdate
      initialData={instrumentToEdit}
      updateFn={updateFundingInstrument}
    />
  );
};


export const EditType = () => {
  const { id } = useParams();
  const { data: types = [] } = useGetFundingTypesQuery();
  const [updateFundingType] = useUpdateFundingTypeMutation();

  const typeToEdit = types.find(item => item._id === id || item.id === id);

  if (!typeToEdit) return <div>Loading type...</div>;

  return (
    <FundingForm
      title="Funding Type"
      isUpdate
      initialData={typeToEdit}
      updateFn={updateFundingType}
    />
  );
};

export const EditRound = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetFundingRoundsQuery();
  const [updateFundingRound] = useUpdateFundingRoundMutation();

  const rounds = data?.fundingRounds || [];

  const roundToEdit = rounds.find(item => item._id === id || item.id === id);

  if (isLoading || !roundToEdit) return <div>Loading round...</div>;

  return (
    <FundingForm
      title="Funding Round"
      isUpdate
      initialData={roundToEdit}
      updateFn={updateFundingRound}
    />
  );
};
