import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";


export const createVehicle = async (req: Request, res: Response) => {
    try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create vehicle",
    });
  }
};


export const getAllVehicles = async (req: Request, res: Response) => {
    try {
    const vehicle = await vehicleService.getAllVehicles();


if (vehicle.length===0) {
   return res.status(201).json({
      success: true,
      message: "no Vehicle found ",
      data: [],
    });
}
  return res.status(200).json({
      success: true,
      message: "all Vehicles ",
      data: vehicle
    });

   
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message ,
    });
  }
};




export const vehicleControllers={

createVehicle,
getAllVehicles
}