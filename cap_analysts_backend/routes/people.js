import express from 'express';
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} from "../controllers/people.js"

const router = express.Router();

router.post('/', createEmployee); // Create a new employee
router.get('/', getEmployees); // Get all employees
router.get('/:id', getEmployeeById); // Get an employee by ID
router.put('/:id', updateEmployee); // Update an employee by ID
router.delete('/:id', deleteEmployee); // Delete an employee by ID

export default router;