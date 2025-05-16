// EditEmployee.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from 'state/api';
import CreateEmployee from 'components/CreateEmployee';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, isLoading } = useGetEmployeeByIdQuery(id);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (employee?.data) {
      const emp = employee.data;
      setFormData({
        title: emp.title || "",
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        phoneNumbers: emp.phoneNumbers || "",
        organizationId: emp.organizationId || "",
        position: emp.position || "",
        department: emp.department || "",
        hireDate: emp.hireDate ? new Date(emp.hireDate) : null,
        address: emp.address || "",
        linkedInUrl: emp.linkedInUrl || "",
        bio: emp.bio || "",
        photoUrl: emp.photoUrl || "",
      });
    }
  }, [employee]);

  if (isLoading || !formData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-6 shadow-lg rounded-lg'>
      <h1 className='text-2xl font-bold mb-4'>Edit Employee</h1>
      <CreateEmployee
        type="update"
        employee={formData}
        employeeId={id}
      />
    </div>
  );
};

export default EditEmployee;
