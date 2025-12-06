import express from "express"
import { createVehicle, getAllVehicles } from "./vehicle.controller";


const router=express.Router();
router.post("/", createVehicle);
router.get("/",getAllVehicles);

export const vehicleRoutes=router;