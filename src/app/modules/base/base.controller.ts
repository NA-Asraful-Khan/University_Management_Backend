/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// src/controllers/base.controller.ts
import { Request, Response } from 'express';
import { Document } from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { handleResponse } from '../../utils/responseHandler';
import { BaseService } from './base.service';
import AppError from '../../errors/AppError';

export class BaseController<T extends Document> {
  constructor(protected service: BaseService<T>) {}

  create = catchAsync(async (req, res): Promise<void> => {
    const item = await this.service.create(req.body);
    handleResponse.sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  });

  findById = catchAsync(async (req, res): Promise<void> => {
    const item = await this.service.findById(req.params.id);
    if (item) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
    }
  });

  findAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const items = await this.service.findAll();
    handleResponse.sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Items retrieved successfully',
      data: items,
    });
  });

  findPaginationQuery = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const items = await this.service.findPaginationQuery(req.query);

      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Items retrieved successfully',
        data: items.result,
        pagination: items.pagination,
      });
    },
  );

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.update(req.params.id, req.body);
    if (item) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
    }
  });

  softDelete = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const item = await this.service.softDelete(req.params.id);
      if (item) {
        handleResponse.sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Item Deleted successfully',
        });
      } else {
        throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
      }
    },
  );

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.delete(req.params.id);
    if (item) {
      handleResponse.sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item deleted successfully',
        data: item,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Item not found');
    }
  });
}
