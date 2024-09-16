import { Response } from 'express';

const handleResponseSuccess = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: unknown = null,
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const handleError = (
  res: Response,
  error: unknown | null,
  message: string = 'An error occurred',
  statusCode: number = 500,
) => {
  let errorMessage = 'Internal Server Error';

  // Type guard to check if 'error' is an object and has a 'message' property
  if (isErrorWithMessage(error)) {
    errorMessage = error.message;
  }

  // Check if 'errors' exists and is an array with a 'message' property
  if (isErrorWithErrors(error)) {
    if (error.errors[0] && error.errors[0].message) {
      errorMessage = error.errors[0].message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorMessage,
  });
};

// Type guard for objects with a 'message' property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  );
}

// Type guard for objects with an 'errors' array property
function isErrorWithErrors(
  error: unknown,
): error is { errors: { message: string }[] } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors: unknown }).errors)
  );
}

export const handleResponse = {
  handleResponseSuccess,
  handleError,
};
