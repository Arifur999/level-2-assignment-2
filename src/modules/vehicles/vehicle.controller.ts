import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

// POST 
const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create vehicle",
    });
  }
};

// GET 
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    if (vehicles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve vehicles",
    });
  }
};

// GET 
const getVehicleByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle id",
      });
    }

    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve vehicle",
    });
  }
};

// PUT
 const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle id",
      });
    }

    const updated = await vehicleService.updateVehicle(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update vehicle",
    });
  }
};

// DELETE 
 const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle id",
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
      message: error.message || "Failed to delete vehicle",
    });
  }
};


export const vehicleControllers={

createVehicle,
getAllVehicles,
getVehicleByIdController,
updateVehicle,
deleteVehicle
}