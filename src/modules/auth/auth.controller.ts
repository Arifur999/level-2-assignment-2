
import { Request, Response } from "express";
import { authService } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user, 
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const data = await authService.signin(req.body); 

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to login",
    });
  }
};


export const authController={
signin,
signup
}