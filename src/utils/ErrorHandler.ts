class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: any, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
