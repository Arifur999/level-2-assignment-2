import express from "express"
import { createVehicle } from "./vehicle.controller";


const router=express.Router();
router.post("/", createVehicle);

export const vehicleRoutes=router;