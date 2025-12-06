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

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const updated = await vehicleService.updateVehicle(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

  
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const deleted = await vehicleService.deleteVehicle(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,  
    });
  }
};



export const vehicleControllers={

createVehicle,
getAllVehicles,
updateVehicle,
deleteVehicle
}