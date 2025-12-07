"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const db_1 = require("../../config/db");
const calculateNumberOfDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const days = diffMs / (1000 * 60 * 60 * 24);
    return Math.ceil(days);
};
// CREATE BOOKING 
const createBooking = async (payload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const numberOfDays = calculateNumberOfDays(rent_start_date, rent_end_date);
    if (numberOfDays <= 0) {
        throw new Error("rent_end_date must be after rent_start_date");
    }
    // vehicle check
    const vehicleResult = await db_1.pool.query(`SELECT id, vehicle_name, daily_rent_price, availability_status 
     FROM vehicles 
     WHERE id = $1`, [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    const vehicle = vehicleResult.rows[0];
    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available for booking");
    }
    const total_price = Number(vehicle.daily_rent_price) * numberOfDays;
    // booking insert
    const bookingResult = await db_1.pool.query(`
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
    const booking = bookingResult.rows[0];
    // vehicle = booked
    await db_1.pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);
    return {
        ...booking,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: Number(vehicle.daily_rent_price),
        },
    };
};
// GET all bookings 
const getAllBookings = async () => {
    const result = await db_1.pool.query(`
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id
    `);
    return result.rows.map((row) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: Number(row.total_price),
        status: row.status,
        customer: {
            name: row.customer_name,
            email: row.customer_email,
        },
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
        },
    }));
};
// UPDATE booking 
const updateBooking = async (bookingId, payload) => {
    const { status } = payload;
    const result = await db_1.pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (result.rows.length === 0) {
        return null;
    }
    const booking = result.rows[0];
    // booking status update
    const updatedResult = await db_1.pool.query(`
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *
    `, [status, bookingId]);
    const updated = updatedResult.rows[0];
    if (status === "cancelled" || status === "returned") {
        await db_1.pool.query(`
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `, [booking.vehicle_id]);
    }
    return updated;
};
exports.bookingService = {
    createBooking,
    getAllBookings,
    updateBooking,
};
