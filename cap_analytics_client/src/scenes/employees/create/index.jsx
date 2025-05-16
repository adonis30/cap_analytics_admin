import React from 'react'
import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CreateEmployee from 'components/CreateEmployee'
import { useCreateEmployeeMutation } from 'state/api'

const CreateEmployeePage  = () => {
    const navigate = useNavigate();
     
    const [createEmployee] = useCreateEmployeeMutation();

    const handleCreate = async (employeeData) => {
        try {
            await createEmployee(employeeData).unwrap();
            alert("Employee created successfully");
            navigate('/employees');
        } catch (error) {
            alert("Failed to create the employee: " + error.message);
        }
    }

  return (
    
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Employee</h1>
      <CreateEmployee onSubmit={handleCreate}/>
    </div>
    
  )
}

export default CreateEmployeePage