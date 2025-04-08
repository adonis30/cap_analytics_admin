// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Flag for operational errors
    Error.captureStackTrace(this, this.constructor); // For better stack traces
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 400);
  }
}

class DuplicateError extends AppError {
  constructor(message = 'Duplicate field value entered') {
    super(message, 400);
  }
}

// Enhanced Error Middleware
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };

  // Default fallback
  error.message = err.message || 'Server Error';

  // Log the error
  console.error(err);

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new NotFoundError();
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    error = new DuplicateError();
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ValidationError(message);
  }

  // Send the error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });

  // Pass the error to the next middleware if necessary
  next(error);
};

export default errorMiddleware;
