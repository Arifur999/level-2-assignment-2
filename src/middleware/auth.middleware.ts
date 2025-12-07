import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";


export interface JwtUserPayload {
  id: number;
  role: "admin" | "customer";
  iat?: number;
  exp?: number;
}

// auth middleware
export const auth =
  (...allowedRoles: ("admin" | "customer")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing or invalid token",
        });
      }

      const token = authHeader.split(" ")[1];

      // token verify + own payload type এ cast
      const decoded = jwt.verify(  token!,  config.jwt_secret as string)as unknown  as JwtUserPayload;
      
      
      

      if (!decoded.id || !decoded.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token payload",
        });
      }

      // req.user এ set করা
      (req as any).user = {
        id: decoded.id,
        role: decoded.role,
      };

      // role-based check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  };
