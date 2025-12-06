import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const data = await bookingService.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message ,
    });
  }
};

 const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (isNaN(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const updated = await bookingService.updateBooking(bookingId, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    let msg = "Booking updated";

    if (updated.status === "cancelled") {
      msg = "Booking cancelled successfully";
    } else if (updated.status === "returned") {
      msg = "Booking marked as returned. Vehicle is now available";
    }

    return res.status(200).json({
      success: true,
      message: msg,
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message ,
    });
  }
};


export const bookingController={
createBooking,
getBookings,
updateBooking,
}
