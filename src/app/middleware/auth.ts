import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Auth
    const token = req.headers.authorization;
    // if the token is sent from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You must be logged in');
    }
    // check if the token is valid
    jwt.verify(token, config.jwt_secret as string, function (err, decoded) {
      // error
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are Unauthorized');
      }
      // decoded Undefined
      // check roles
      const role = (decoded as JwtPayload).role;
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are Unauthorized');
      }
      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;