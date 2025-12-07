"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const createBooking = async (req, res) => {
    try {
        const data = await booking_service_1.bookingService.createBooking(req.body);
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getBookings = async (req, res) => {
    try {
        const bookings = await booking_service_1.bookingService.getAllBookings();
        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const bookingId = Number(req.params.bookingId);
        if (isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking id",
            });
        }
        const updated = await booking_service_1.bookingService.updateBooking(bookingId, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        let msg = "Booking updated";
        if (updated.status === "cancelled") {
            msg = "Booking cancelled successfully";
        }
        else if (updated.status === "returned") {
            msg = "Booking marked as returned. Vehicle is now available";
        }
        return res.status(200).json({
            success: true,
            message: msg,
            data: updated,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.bookingController = {
    createBooking,
    getBookings,
    updateBooking,
};
