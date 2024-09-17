import { Response } from 'express';
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
};

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

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || '',
    data: data.data,
  });
};

export const handleResponse = {
  handleResponseSuccess,
  sendResponse,
};
