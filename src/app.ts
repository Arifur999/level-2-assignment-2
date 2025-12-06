import express, { Application } from 'express';
import cors from 'cors';
import initDB from './config/db';
import { userRoutes } from './modules/users/user.routes';

const app = express();

initDB()

app.use(cors());
app.use(express.json());


app.use("/api/v1/auth/signup",userRoutes)

export default app;
