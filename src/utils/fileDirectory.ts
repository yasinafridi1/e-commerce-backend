import { unlink, existsSync, mkdirSync } from "fs";
import path from "path";

export const removeImage = (fileName: string) => {
  if (!fileName) return;
  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  if (!existsSync(filePath)) {
    console.log(`File not found or may have been deleted: ${filePath}`);
  } else {
    unlink(filePath, (err: any) => {
      if (err) {
        console.log(`Couldnot delete file ${filePath}`);
      }
    });
  }
  return;
};

export const makeRequiredDirectories = () => {
  const directories = ["uploads", "uploads/products"];
  directories.forEach((directory) => {
    const dir = path.join(__dirname, `../${directory}`);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
};
