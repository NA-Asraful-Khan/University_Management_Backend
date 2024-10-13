/* eslint-disable no-unused-vars */
// src/routes/base.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { AnyZodObject } from 'zod'; // Import the auth middleware
import { BaseController } from './base.controller';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { TUserRole } from '../user/user.interface';

interface ValidationSchemas {
  create?: AnyZodObject;
  update?: AnyZodObject;
}

export class BaseRoute<T extends Document> {
  public router: Router;

  constructor(
    protected controller: BaseController<T>,
    private validationSchemas?: ValidationSchemas,
    private createRoles: TUserRole[] = [], // Add required roles for create
    private updateRoles: TUserRole[] = [], // Add required roles for update
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Use auth and validation for POST route (create)
    const createAuth = auth(...this.createRoles);
    const createValidation = this.validationSchemas?.create
      ? validateRequest(this.validationSchemas.create)
      : (req: Request, res: Response, next: NextFunction) => next();

    // Use auth and validation for PUT/PATCH routes (update)
    const updateAuth = auth(...this.updateRoles);
    const updateValidation = this.validationSchemas?.update
      ? validateRequest(this.validationSchemas.update)
      : (req: Request, res: Response, next: NextFunction) => next();

    this.router.post('/', createAuth, createValidation, this.controller.create);
    this.router.put(
      '/:id',
      updateAuth,
      updateValidation,
      this.controller.update,
    );
    this.router.patch(
      '/:id',
      updateAuth,
      updateValidation,
      this.controller.update,
    );

    // No validation or auth needed for the following routes
    this.router.get('/:id', this.controller.findById);
    this.router.get('/', this.controller.findAll);
    this.router.get('/pagination/query', this.controller.findPaginationQuery);
    this.router.delete('softDelete/:id', this.controller.softDelete);
    this.router.delete('/:id', this.controller.delete);
  }
}
