

import express from "express";
import { vehicleControllers } from "./vehicle.controller";


const router = express.Router();

router.post("/", vehicleControllers.createVehicle);               // POST /api/v1/vehicles
router.get("/", vehicleControllers.getAllVehicles);               // GET  /api/v1/vehicles
router.get("/:vehicleId", vehicleControllers.getVehicleByIdController); // GET /api/v1/vehicles/:vehicleId
router.put("/:vehicleId", vehicleControllers.updateVehicle);      // PUT  /api/v1/vehicles/:vehicleId
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);   // DEL  /api/v1/vehicles/:vehicleId

export const vehicleRoutes = router;
