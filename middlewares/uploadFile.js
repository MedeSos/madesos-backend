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

const typeAllowedImage = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/gif": "gif",
}

const typeAllowedVideo = {
  "video/mp4": "mp4",
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(typeAllowedVideo[file.mimetype]){ 
      return cb(null, "public/uploads/videos");
    }else if(typeAllowedImage[file.mimetype]){
      return cb(null, "public/uploads/images");
    }
  },
  filename: (req, file, cb) => {
    const random = Math.round(Math.random() * 1000000000);
    cb(null, file.fieldname + "-" + Date.now() + "-" + random + path.extname(file.originalname));
  },
});

const fileFilterImage = (req, file, cb) => {
  const isValid = typeAllowedImage[file.mimetype];
  let error = null;
  if (!isValid) {
    error = {
      error: "INVALID_FILETYPE",
      statusCode: 400,
      message: `Only file image type ${Object.values(typeAllowedImage)} are allowed!`,
    }
  }

  if (error) return cb(error, false);

  cb(null, true);
}

export const uploadImage = multer({ storage, fileFilter: fileFilterImage});

const fileFilterVideo = (req, file, cb) => {
  const isValid = typeAllowedVideo[file.mimetype];
  let error = null;
  if (!isValid) {
    error = {
      error: "INVALID_FILETYPE",
      statusCode: 400,
      message: `Only file video type ${Object.values(typeAllowedVideo)} are allowed!`,
    }
  }
  
  if (error) return cb(error, false);
  
  cb(null, true);
}

export const uploadVideo = multer({ storage, fileFilter: fileFilterVideo});