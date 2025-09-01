import 'express-async-errors';
import express from "express";
import { initializeApp } from 'firebase-admin/app';
import { routes } from './routes';
import { ErrorHandling } from './middleware/ErrorHandler';

initializeApp();
const app = express();
app.use(express.json());
app.use(routes);
app.use(ErrorHandling);


export { app };