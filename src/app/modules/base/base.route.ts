/* eslint-disable no-unused-vars */
// src/routes/base.route.ts
import { Router } from 'express';

import { Document } from 'mongoose';
import { BaseController } from './base.controller';

// Constrain T to extend Mongoose's Document
export class BaseRoute<T extends Document> {
  public router: Router;

  constructor(protected controller: BaseController<T>) {
    this.router = Router();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post('/', this.controller.create);
    this.router.get('/:id', this.controller.findById);
    this.router.get('/', this.controller.findAll);
    this.router.get('/pagination', this.controller.findPaginationQuery);
    this.router.put('/:id', this.controller.update);
    this.router.patch('/:id', this.controller.update);
    this.router.delete('/:id', this.controller.softDelete);
    this.router.delete('/:id', this.controller.delete);
  }
}
