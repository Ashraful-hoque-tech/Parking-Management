import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/database.js';
import parkingRoutes from './routes/parking.route.js';

connectDB();

const app = express();
app.use(express.json());

app.use('/api', parkingRoutes);

export default app;
