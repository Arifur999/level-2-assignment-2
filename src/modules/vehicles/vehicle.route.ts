import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import { auth } from "../../middleware/auth.middleware";


const router = express.Router();

router.post("/",auth("admin"), vehicleControllers.createVehicle);               
router.get("/", vehicleControllers.getAllVehicles);               
router.get("/:vehicleId", vehicleControllers.getVehicleByIdController); 
router.put("/:vehicleId",auth("admin"), vehicleControllers.updateVehicle);      
router.delete("/:vehicleId",auth("admin"), vehicleControllers.deleteVehicle);  

export const vehicleRoutes = router;
