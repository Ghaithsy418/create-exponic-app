import mongoose from 'mongoose';
import { app } from './app.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_LOCAL || '')
  .then(() => console.log('Successfully connected to database'));

app.listen(port, () => {
  console.log(`Exponic.js is running at http:localhost:${port}`);
});
