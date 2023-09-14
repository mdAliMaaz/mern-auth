import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Cors from 'cors';
import userRouter from './routes/userRoutes.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import dbConnect from './config/dbConfig.js';


const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Cors({ origin: "http://localhost:5173", credentials: true }));
dotenv.config();


// routes
app.use('/', userRouter)

// Database connection
dbConnect(process.env.MONGODB_URL);


// handlling errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`server listening on ${PORT}🎉`));