// routes/userRoutes.js
import express from 'express';
import { login, registerUser, getUsers, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
 

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUser);
router.get('/users', getUsers);
router.get('/me', authenticate, getCurrentUser);


export default router;
