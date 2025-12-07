"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const auth_service_1 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const user = await auth_service_1.authService.signup(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to register user",
        });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const data = await auth_service_1.authService.signin(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to login",
        });
    }
};
exports.signin = signin;
