import fs from "fs";
import path from "path";

// Create a writable stream for the error log
const errorLogStream = fs.createWriteStream(
  path.join(__dirname, "../error.log"),
  {
    flags: "a",
  }
);

// Custom error logging function
function logError(error: any) {
  const errorMessage = `[${new Date().toISOString()}] ${
    error.stack || error
  }\n`;
  errorLogStream.write(errorMessage);
}

export default logError;
