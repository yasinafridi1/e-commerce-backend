const { ValidationError } = require("express-validation");
const logError = require("../utils/errorLogger");

const ErrorMiddleware = (err, req, res, next) => {
  logError(err);
  err.message = err.message || "Internal server error";
  err.statusCode = err?.statusCode || 500;
  if (err instanceof ValidationError) {
    err.message = err?.details?.body[0]?.message;
    err.statusCode = 422;
  }

  console.log(err);
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = ErrorMiddleware;
