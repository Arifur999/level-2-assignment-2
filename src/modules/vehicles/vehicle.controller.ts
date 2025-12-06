import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";


export const createVehicle = async (req: Request, res: Response) => {
    console.log("✅ /api/v1/vehicles route hit hocche, body:", req.body);
    try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("❌ Vehicle create error:", error); 
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create vehicle",
    });
  }
};




export const vehicleControllers={

createVehicle,
}