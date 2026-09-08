import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadOnCloudinary = (file, folder = "avatars") =>
  new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return reject(
        new Error("A file buffer is required for Cloudinary upload"),
      );
    }

    const appFolder = process.env.CLOUDINARY_APP_FOLDER;

    if (!appFolder) {
      return reject(new Error("CLOUDINARY_APP_FOLDER is not configured"));
    }

    const cloudinaryFolder = `${appFolder}/${folder}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: cloudinaryFolder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
cloudinary.api
  .ping()
  .then((result) => {
    console.log("Cloudinary connection:", result);
  })
  .catch((error) => {
    console.error("Cloudinary connection failed:", error);
  });
