import { Response } from 'express';

type TPagination = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  pagination?: TPagination;
  data?: T;
};

const handleResponseSuccess = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  pagination: unknown = null,
  data: unknown = null,
) => {
  res.status(statusCode).json({
    success,
    message,
    pagination,
    data,
  });
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || '',
    pagination: data.pagination,
    data: data.data,
  });
};

export const handleResponse = {
  handleResponseSuccess,
  sendResponse,
};
