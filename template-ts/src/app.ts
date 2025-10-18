import express, { Express } from 'express';
import morgan from 'morgan';

export const app: Express = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('/public'));
