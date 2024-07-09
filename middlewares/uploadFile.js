import multer from "multer";
import path from "path";

export const requiredMedia = (req, res, next) => {
  if (!req.file) return res.status(400).json({
    error: "REQUIRED_FILE",
    statusCode: 400,
    message: "File is required"
  });
  next();
}

export const typeAllowed = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "video/mp4": "video",
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // if(file.fieldname==="blog-banner") return cb(null, "public/uploads/blogs");
    // if(file.fieldname==="image") return cb(null, "public/uploads/images");
    // if(file.fieldname==="video") return cb(null, "public/uploads/videos");

    if(typeAllowed[file.mimetype]!=="video") return cb(null, "public/uploads/images");
    // else
    cb(null, "public/uploads/videos");
  },
  filename: (req, file, cb) => {
    const random = Math.round(Math.random() * 1000000000);
    cb(null, file.fieldname + "-" + Date.now() + "-" + random + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = typeAllowed[file.mimetype];
  let error = null;
  if (!isValid) {
    error = {
      error: "INVALID_FILETYPE",
      statusCode: 400,
      message: `Only file image and video type ${Object.values(typeAllowed)} are allowed!`,
    }
  }

  if (error) return cb(error, false);

  cb(null, true);
}

export const upload = multer({ storage, fileFilter});

