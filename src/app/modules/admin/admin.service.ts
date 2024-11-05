import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AdminSearchableFields } from './admin.constant';
import { AdminModel } from './admin.model';
import { TAdmin } from './admin.interface';
import mongoose from 'mongoose';
import { UserModel } from '../user/user.model';

const getAllAdmins = async () => {
  const result = await AdminModel.find();
  return result;
};

const getAdminsByPaginatedQuery = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(AdminModel.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;

  const pagination = await adminQuery.countTotal();
  return {
    result,
    pagination,
  };
};

const getSingleAdmin = async (id: string) => {
  const checkAdminAndUserExist = await AdminModel.isUserExists(id);
  if (!checkAdminAndUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin with this Id Not Exist');
  }
  const result = await AdminModel.findOne({ id: id });
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const checkAdminAndUserExist = await AdminModel.isUserExists(id);
  if (!checkAdminAndUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin with this Id Not Exist');
  }
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteAdmin = async (id: string) => {
  const checkAdminAndUserExist = await AdminModel.isUserExists(id);
  if (!checkAdminAndUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin with this Id Not Exist');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedAdmin = await AdminModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete Admin');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Delete User');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, 'Error Deleting Admin');
  }
};

export const AdminServices = {
  getAllAdmins,
  getAdminsByPaginatedQuery,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
