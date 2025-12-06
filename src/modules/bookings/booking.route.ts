import express from "express"
import { bookingController } from "./booking.controller";


const router=express.Router();
router.post("/",bookingController.createBooking)
router.get("/",bookingController.getBookings)
router.post("/",bookingController.updateBooking)


export const bookingRoutes=router;