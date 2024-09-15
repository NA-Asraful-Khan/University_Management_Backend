import { Response } from 'express';

const handleResponse = (
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

export default handleResponse;
