"use strict";
// src/modules/vehicles/vehicle.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = void 0;
const db_1 = require("../../config/db");
// CREATE vehicle
const createVehicle = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = payload;
    const result = await db_1.pool.query(`
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result.rows[0];
};
// GET all vehicles
const getAllVehicles = async () => {
    const result = await db_1.pool.query(`
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    ORDER BY id
    `);
    return result.rows;
};
// GET vehicle by ID
const getVehicleById = async (id) => {
    const result = await db_1.pool.query(`SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`, [id]);
    return result.rows[0] || null;
};
// UPDATE vehicle
const updateVehicle = async (id, payload) => {
    const existing = await getVehicleById(id);
    if (!existing)
        return null;
    const updated = {
        vehicle_name: payload.vehicle_name ?? existing.vehicle_name,
        type: payload.type ?? existing.type,
        registration_number: payload.registration_number ?? existing.registration_number,
        daily_rent_price: payload.daily_rent_price ?? existing.daily_rent_price,
        availability_status: payload.availability_status ?? existing.availability_status,
    };
    const result = await db_1.pool.query(`
    UPDATE vehicles
    SET vehicle_name = $1,
        type = $2,
        registration_number = $3,
        daily_rent_price = $4,
        availability_status = $5
    WHERE id = $6
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `, [
        updated.vehicle_name,
        updated.type,
        updated.registration_number,
        updated.daily_rent_price,
        updated.availability_status,
        id,
    ]);
    return result.rows[0];
};
// DELETE vehicle
const deleteVehicle = async (id) => {
    // check for active bookings
    const activeBookings = await db_1.pool.query(`SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [id]);
    if (activeBookings.rows.length > 0) {
        throw new Error("Vehicle cannot be deleted because it has active bookings");
    }
    const result = await db_1.pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
};
exports.vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
