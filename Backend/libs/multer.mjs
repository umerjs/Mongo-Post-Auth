import multer from "multer";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const multerMiddleware = multer({
  // memoryStorage keeps the file as a Buffer in req.file.buffer.
  // No disk writes, no /tmp cleanup, works cleanly in serverless (Vercel) too.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
    }
    cb(null, true);
  },
});

// Reusable Express middleware: wraps multer's single-file upload for a given
// field name and turns its errors into a clean JSON response instead of
// leaking Multer's internal error shape.
export const handleAvatarUpload = (req, res, next) => {
  multerMiddleware.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 2MB or smaller"
          : err.message;
      return res.status(400).send({ message });
    }
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    next();
  });
};
