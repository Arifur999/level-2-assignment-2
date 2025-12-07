import express from "express"
import { bookingController } from "./booking.controller";
import { auth } from "../../middleware/auth.middleware";


const router=express.Router();
router.post("/",auth("admin","customer"), bookingController.createBooking)
router.get("/",auth("admin","customer"),bookingController.getBookings)
router.put("/:bookingId", auth("admin", "customer"), bookingController.updateBooking);

export const bookingRoutes=router;