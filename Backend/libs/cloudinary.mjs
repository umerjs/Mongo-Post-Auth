import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (file, userId) => {
  if (!file?.path) {
    throw new Error("File path is missing");
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      asset_folder: `users/${userId}/avatar`,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  } finally {
    // Delete temporary file from your server
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Failed to delete temporary file:", err);
      }
    });
  }
};
