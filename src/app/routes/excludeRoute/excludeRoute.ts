import { Request, Response, Router } from 'express';

export const setMethodNotAllowed = (
  router: Router,
  method: 'get' | 'patch' | 'put' | 'delete' | 'post',
  path: string,
  message: string,
): void => {
  router[method](path, (req: Request, res: Response) => {
    res.status(403).json({
      success: false,
      message,
    });
  });
};
