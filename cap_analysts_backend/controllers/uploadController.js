import { UTApi } from 'uploadthing/server';

const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_API_KEY, // Ensure this matches your server configuration
  // Additional configuration as needed
});

export const handleUpload = async (req, res) => {
  try {
    // Ensure a file is included in the request
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Create a UTFile instance from the uploaded file
    const file = new UTFile([req.file.buffer], req.file.originalname, {
      customId: req.file.filename, // Optional: Set a custom ID for the file
    });

    // Upload the file using UTApi
    const uploadResponse = await utapi.uploadFiles([file]);

    // Check if the upload was successful
    if (uploadResponse?.[0]?.data) {
      res.status(200).json({
        success: true,
        fileUrl: uploadResponse[0].data.url,
        fileKey: uploadResponse[0].data.key,
      });
    } else {
      throw new Error('File upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
};
