import express from 'express';
import cors from 'cors';
import initDB from './config/db';
import { userRoutes } from './modules/users/user.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
import { bookingRoutes } from './modules/bookings/booking.route';
import { authRoutes } from './modules/auth/auth.route';

const app = express();

initDB()

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/signup",userRoutes)
app.use ("/api/v1/vehicles",vehicleRoutes)
app.use("/api/v1/bookings",bookingRoutes)

export default app;
