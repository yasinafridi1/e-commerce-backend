import multer from "multer";
import path from "path";
import fs from "fs";

// Determine folder based on fieldname or any custom logic
const getUploadFolder = (fieldname: string) => {
  console.log("Field name ", fieldname);
  switch (fieldname) {
    case "images":
      return path.resolve(__dirname, "../uploads/products");
    case "profile":
      return path.resolve(__dirname, "../uploads/users");
    default:
      return path.resolve(__dirname, "../uploads/misc");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getUploadFolder(file.fieldname);
    fs.mkdirSync(folder, { recursive: true }); // Ensure folder exists
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
