// utils/uploadthingConfig.js

import { initUploadthing } from '@uploadthing/react';

// Initialize Uploadthing
const { createUploadthing, getUploadthingUrl } = initUploadthing();

// Create the file router for your uploads
export const OurFileRouter = createUploadthing()
  .router()
  .mutation('uploadFile', {
    input: (input) => input, // You can add any validation or data handling here
    resolve: async ({ input }) => {
      // Handle file upload logic here
      const uploadedFileUrl = await getUploadthingUrl(input.file);
      return uploadedFileUrl;
    },
  });
