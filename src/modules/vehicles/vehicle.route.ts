import express from "express"
import { createVehicle, deleteVehicle, getAllVehicles, updateVehicle } from "./vehicle.controller";


const router=express.Router();
router.post("/", createVehicle);
router.get("/",getAllVehicles);
router.put("/:vehicleId",updateVehicle);
router.delete("/:vehicleId",deleteVehicle)

export const vehicleRoutes=router;