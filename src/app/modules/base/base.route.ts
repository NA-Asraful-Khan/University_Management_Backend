/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/routes/base.route.ts
import { Router } from 'express';
import { Document } from 'mongoose';
import { BaseController } from './base.controller';
import { AnyZodObject } from 'zod';
import validateRequest from '../../middleware/validateRequest';

interface ValidationSchemas {
  create?: AnyZodObject;
  update?: AnyZodObject;
}

export class BaseRoute<T extends Document> {
  public router: Router;

  constructor(
    protected controller: BaseController<T>,
    private validationSchemas?: ValidationSchemas, // Accept both create and update schemas
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // Use the create validation schema for POST routes, if provided
    const createValidation = this.validationSchemas?.create
      ? validateRequest(this.validationSchemas.create)
      : (req: any, res: any, next: any) => next();

    // Use the update validation schema for PUT/PATCH routes, if provided
    const updateValidation = this.validationSchemas?.update
      ? validateRequest(this.validationSchemas.update)
      : (req: any, res: any, next: any) => next();

    this.router.post('/', createValidation, this.controller.create);
    this.router.put('/:id', updateValidation, this.controller.update);
    this.router.patch('/:id', updateValidation, this.controller.update);

    // No validation needed for the following routes
    this.router.get('/:id', this.controller.findById);
    this.router.get('/', this.controller.findAll);
    this.router.get('/pagination/query', this.controller.findPaginationQuery);
    this.router.delete('softDelete/:id', this.controller.softDelete);
    this.router.delete('/:id', this.controller.delete);
  }
}
