import { createUploadthing } from "@uploadthing/client";

// Fake auth function, replace with your actual authentication logic
const auth = async () => {
  return { id: "fakeId" };  // Replace with real authentication logic
};

// Create the Uploadthing router with your file upload configurations
export const ourFileRouter = createUploadthing()
  .router({
    imageUploader: uploadthing.upload({
      file: "image",  // Define file type as image
      maxFileSize: 4 * 1024 * 1024,  // 4MB max file size
    }),
  })
  .middleware(async () => {
    const user = await auth();

    if (!user) throw new Error("Unauthorized");

    return { userId: user.id };  // Attach the user ID to the metadata
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId);
    console.log("File URL:", file.url);  // Log the URL of the uploaded file
    return { uploadedBy: metadata.userId };  // Return the metadata with userId
});
