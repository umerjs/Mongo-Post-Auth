import multer from "multer";
import fs from "fs";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = os.tmpdir();

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, `image-${uniqueSuffix}`);
  },
});

export const multerMiddleware = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, //2 MB
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});
