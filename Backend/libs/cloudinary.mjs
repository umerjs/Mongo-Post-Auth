import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an in-memory file buffer (from multer.memoryStorage()) to Cloudinary.
 * No temp file is written to disk, so there's nothing to clean up afterward.
 */
export const uploadOnCloudinary = (file, userId) => {
  if (!file?.buffer) {
    return Promise.reject(new Error("File buffer is missing"));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        asset_folder: `users/${userId}/avatar`,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });
};
