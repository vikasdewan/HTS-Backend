class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // Call parent class (Error) constructor
    this.statusCode = statusCode;
    this.data = null; // this.data = null should not be wrapped in parentheses
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack; // If stack is passed, use it
    } else {
      // Capture the stack trace for debugging
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

