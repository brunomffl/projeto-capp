import 'express-async-errors';
import express from "express";
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { routes } from './routes';
import { ErrorHandling } from './middleware/ErrorHandler';

const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(routes);
app.use(ErrorHandling);

export { app };