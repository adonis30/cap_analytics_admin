import express from 'express';
import {  getUser,getAllUsers, createUser, updateUser, deleteUser} from '../controllers/user.js';


const router = express.Router();

// Routes Fusers
router.get('/:id', getUser);
router.get("/", getAllUsers); // Fetch a single User by ID
router.post("/", createUser); // Add a new User
router.put("/:id", updateUser); // Update a User by ID
router.delete("/:id", deleteUser); // Delete a User by ID

export default router;

