"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// auth middleware
const auth = (...allowedRoles) => (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        if (!decoded.id || !decoded.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token payload",
            });
        }
        // req.user এ set করা
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        // role-based check
        if (allowedRoles.length > 0 &&
            !allowedRoles.includes(decoded.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Insufficient permissions",
            });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};
exports.auth = auth;
