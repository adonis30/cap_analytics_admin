import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { UploadDropzone } from "@uploadthing/react";
import { toast } from "react-toastify"; // Optional: For notifications

const FileUploader = ({ onFileChange, setFiles }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Callback when files are selected/dropped
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFiles([file]); // Set the file for parent state

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }, [setFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Only accept images
    multiple: false,   // Allow only one file at a time
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2" color="textSecondary">
          Drag & drop an image here, or click to select one
        </Typography>
      </Box>

      {previewUrl && (
        <Box mt={2}>
          <img
            src={previewUrl}
            alt="Uploaded file preview"
            style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
          />
        </Box>
      )}

      {isUploading && <CircularProgress />}

      {uploadError && (
        <Typography color="error" variant="body2" mt={2}>
          {uploadError}
        </Typography>
      )}

      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            onFileChange(res[0].url); // Send the uploaded file URL to parent
            toast.success("File uploaded successfully!");
            setIsUploading(false);
          }
        }}
        onUploadError={(error) => {
          setUploadError(error.message || "Upload failed.");
          toast.error("Failed to upload file.");
          setIsUploading(false);
        }}
      />
    </Box>
  );
};

export default FileUploader;
