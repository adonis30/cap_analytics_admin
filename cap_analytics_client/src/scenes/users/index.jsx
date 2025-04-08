import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "components/Header";
import { useGetAllUsersQuery, useDeleteUserMutation } from "state/api"; 
import UserGrid from "components/UserGrid";

const Users = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <div>Loading...</div>;

  // Handle User Deletion
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        refetch(); // Refresh the data after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="List of all registered users" />
      
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/users/create")}
        >
          Create New User
        </Button>
      </Box>

      <UserGrid users={users} onDelete={handleDelete} />
    </Box>
  );
};

export default Users;
