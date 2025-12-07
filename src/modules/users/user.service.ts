import { pool } from "../../config/db";
import { UpdateUserPayload } from "./auth.interface";


const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role
    FROM users
    ORDER BY id
  `);

  return result.rows;
};

const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const existing = await getUserById(id);
  if (!existing) return null;

  const updated = {
    name: payload.name ?? existing.name,
    email: payload.email?.toLowerCase() ?? existing.email,
    phone: payload.phone ?? existing.phone,
    role: payload.role ?? existing.role,
  };

  const result = await pool.query(
    `
    UPDATE users
    SET name = $1, email = $2, phone = $3, role = $4
    WHERE id = $5
    RETURNING id, name, email, phone, role
    `,
    [updated.name, updated.email, updated.phone, updated.role, id]
  );

  return result.rows[0];
};

const deleteUser = async (id: number) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("User cannot be deleted because they have active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rows[0] || null;
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
