/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middleware/globalErrorHandler';

const app: Application = express();

app.use(express.json());

app.use(cors());

//ApplicationRoute

app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);

app.use(globalErrorHandler);
// app.get('/', (req: Request, res: Response) => {
//   const a = 10;
//   res.send(a);
// });

export default app;
