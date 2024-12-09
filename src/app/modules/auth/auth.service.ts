import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../../sentEmail';

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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_token_expiration_time as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expiration_time as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const isUserExists = await UserModel.isUserExistsByCustomId(userData?.userId);

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
      payload?.oldPassword,
      isUserExists?.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, `Incorrect password`);
  }
  // Hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // if the token is sent from the client
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You must be logged in');
  }
  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userId, iat } = decoded;

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
      'Your Password is Changed!, Please try to login again',
    );
  }

  // generate and return the JWT token

  const jwtPayload = {
    userId: isUserExists?.id,
    role: isUserExists?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_token_expiration_time as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (id: string) => {
  const isUserExists = await UserModel.isUserExistsByCustomId(id);

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

  const jwtPayload = {
    userId: isUserExists?.id,
    role: isUserExists?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    '10m',
  );
  const resetUiLink = `${config.frontend_url}?id=${isUserExists?.id}&token=${resetToken}`;
  sendEmail(isUserExists?.email, resetUiLink);
  return resetUiLink;
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
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

  // check if the token is valid

  const decoded = verifyToken(token, config.jwt_secret as string);

  if (payload?.id !== decoded?.userId) {
    throw new AppError(httpStatus.FORBIDDEN, `Wrong Id Submitted`);
  }
  // Hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      id: decoded?.userId,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
