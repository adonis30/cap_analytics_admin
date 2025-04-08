// routes/imageRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imageController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('imageUrl'), uploadImage);

export default router;
