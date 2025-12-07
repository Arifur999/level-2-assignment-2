"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.userService.getAllUsers();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve users",
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        const authUser = req.user;
        // Only admin or the user himself can update
        if (authUser &&
            authUser.role === "customer" &&
            authUser.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can update only your own profile",
            });
        }
        const updated = await user_service_1.userService.updateUser(userId, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updated,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update user",
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        const deleted = await user_service_1.userService.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete user",
        });
    }
};
exports.userController = {
    getAllUsers,
    updateUser,
    deleteUser,
};
