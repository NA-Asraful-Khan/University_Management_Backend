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
  error: unknown = null,
  message: string = 'An error occurred',
  statusCode: number = 500,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: (error as Error).message || 'Internal Server Error',
  });
};
export const handleResponse = {
  handleResponseSuccess,
  handleError,
};
