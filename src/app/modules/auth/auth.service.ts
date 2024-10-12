import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  const isUserExists = await UserModel.isUserExistsByCustomId(payload?.id);

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
  // check if the password is incorrect
  if (
    !(await UserModel.isPasswordMatched(
      payload?.password,
      isUserExists?.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, `Incorrect password`);
  }
  // generate and return the JWT token

  const jwtPayload = {
    userId: isUserExists?.id,
    role: isUserExists?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expiration_time,
  });
  return {
    accessToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
