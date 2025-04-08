import express from 'express';
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controllers/people.js"

const router = express.Router();

router.post('/people/', createEmployee); // Create a new employee
router.get('/people/', getEmployees); // Get all employees
router.get('/people/:id', getEmployeeById); // Get an employee by ID
router.put('/people/:id', updateEmployee); // Update an employee by ID
router.delete('/people/:id', deleteEmployee); // Delete an employee by ID

export default router;