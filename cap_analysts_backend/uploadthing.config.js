import { createUploadthing } from 'uploadthing/express';
import dotenv from 'dotenv';

dotenv.config();

const uploadthing = createUploadthing({
  apiKey: process.env.UPLOADTHING_SECRET,
});

export default uploadthing;
