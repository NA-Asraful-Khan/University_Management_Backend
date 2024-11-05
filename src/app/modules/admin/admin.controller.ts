import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdmins();
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Get successfully',
    data: result,
  });
});

const getAdminsByPaginatedQuery = catchAsync(async (req, res) => {
  const result = await AdminServices.getAdminsByPaginatedQuery(req.query);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins Get successfully',
    data: result.result,
    pagination: result.pagination,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdmin(adminId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Get successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const { admin } = req.body;

  const result = await AdminServices.updateAdmin(adminId, admin);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Update successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  await AdminServices.deleteAdmin(adminId);
  handleResponse.sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Delete successfully',
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminsByPaginatedQuery,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
