/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import config from './app/config';

const app: Application = express();

// Render terminates TLS in front of the container. Trust that proxy so
// Secure cookies are actually set in production.
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigin = config.frontend_url?.replace(/\/$/, '');

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

//ApplicationRoute

app.use('/api/v1', router);

// Testing Route

const welcome = async (req: Request, res: Response) => {
  res.send('Welcome to University Management Api');
};

app.get('/', welcome);

// Error Handling Middleware

app.use(globalErrorHandler);
app.use(notFound);

export default app;
