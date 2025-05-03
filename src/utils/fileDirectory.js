const { unlink, existsSync, mkdirSync } = require("fs");
const path = require("path");
const removeImage = (fileName) => {
  if (!fileName) return;
  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  if (!existsSync(filePath)) {
    console.log(`File not found or may have been deleted: ${filePath}`);
  } else {
    unlink(filePath, (err) => {
      if (err) {
        console.log(`Couldnot delete file ${filePath}`);
      }
    });
  }
  return;
};

const makeRequiredDirectories = () => {
  const directories = ["uploads"];
  directories.forEach((directory) => {
    const dir = path.join(__dirname, `../${directory}`);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
};

module.exports = { removeImage, makeRequiredDirectories };
