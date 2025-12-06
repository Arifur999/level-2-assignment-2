import { pool } from "../../config/db";
import { CreateVehiclePayload, UpdateVehiclePayload } from "./vehicle.interface";

//post
const createVehicle = async (payload: CreateVehiclePayload) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

//get all
const getAllVehicles = async () => {
  const result = await pool.query(
    `
    SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    FROM vehicles
    ORDER BY id
    `
  );

  return result.rows;
};

//single id
const getVehicleById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};


//put
const updateVehicle = async (id: number, payload: UpdateVehiclePayload) => {
  const existing = await getVehicleById(id);

  if (!existing) return null;

  const updated = {
    vehicle_name: payload.vehicle_name ?? existing.vehicle_name,
    type: payload.type ?? existing.type,
    registration_number:
      payload.registration_number ?? existing.registration_number,
    daily_rent_price:
      payload.daily_rent_price ?? existing.daily_rent_price,
    availability_status:
      payload.availability_status ?? existing.availability_status,
  };

  const result = await pool.query(
    `
    UPDATE vehicles
    SET vehicle_name = $1,
        type = $2,
        registration_number = $3,
        daily_rent_price = $4,
        availability_status = $5
    WHERE id = $6
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [
      updated.vehicle_name,
      updated.type,
      updated.registration_number,
      updated.daily_rent_price,
      updated.availability_status,
      id,
    ]
  );

  return result.rows[0];
};

//delete
const deleteVehicle = async (id: number) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Vehicle cannot be deleted because it has active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
