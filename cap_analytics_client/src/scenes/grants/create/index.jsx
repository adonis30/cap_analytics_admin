"use client";

import GrantsForm from "components/GrantsForm";
import { useNavigate } from "react-router-dom";
import { useCreateGrantsMutation } from "state/api";
import { toast } from "react-hot-toast";

const CreateGrantPage = () => {
  const navigate = useNavigate();
  const [createGrant] = useCreateGrantsMutation();

  const handleCreateGrant = async (data) => {
    try {
      const response = await createGrant(data).unwrap();
      toast.success("Grant created successfully!");
      navigate("/grants");
    } catch (error) {
      console.error("Error creating grant:", error);
      toast.error("Failed to create grant.");
    }
  };

  return (
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Grant</h1>
      <GrantsForm onSubmit={handleCreateGrant} />
    </div>
  );
};

export default CreateGrantPage;
