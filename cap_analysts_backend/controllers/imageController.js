import ImageKit from 'imagekit';
import 'dotenv/config';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,  
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = (req, res) => {
   

  // Ensure the file is available in the request
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  

  try {
    // Define the file and name to be uploaded to ImageKit
    const file = req.file.buffer;
    const fileName = req.file.originalname;

    // Upload the file to ImageKit
    imagekit.upload(
      {
        file: file,
        fileName: fileName,
        isPrivateFile: false, // Set to true if the file should be private
        tags: ['example_tag'],
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to ImageKit:', error); // Log ImageKit errors
          return res.status(500).send('Error uploading file.');
        }
        // Return the URL of the uploaded file on success
        res.status(200).send({
          message: 'File uploaded successfully.',
          url: result.url,
        });
      }
    );
  } catch (error) {
    // Log unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error.');
  } 
};
