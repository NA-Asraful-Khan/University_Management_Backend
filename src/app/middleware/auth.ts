import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Auth
    const token = req.headers.authorization;
    // if the token is sent from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You must be logged in');
    }
    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    const isUserExists = await UserModel.isUserExistsByCustomId(userId);

    if (!isUserExists) {
      throw new AppError(httpStatus.NOT_FOUND, `User not found with this ID!`);
    }

    // check if the user is already deleted
    const isDeleted = isUserExists?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, `This user is Deleted!`);
    }

    // check if the user is already blocked
    const userStatus = isUserExists?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, `This user is Blocked!`);
    }
    //Check if the password is changed
    if (
      isUserExists.passwordChangeAt &&
      UserModel.isJWTIssuedBeforePasswordChanged(
        isUserExists.passwordChangeAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Your Password is Changed!, Please Try Again!',
      );
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      //Check if the user is authorized
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are Unauthorized');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
