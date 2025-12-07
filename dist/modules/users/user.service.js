"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const db_1 = require("../../config/db");
const getAllUsers = async () => {
    const result = await db_1.pool.query(`
    SELECT id, name, email, phone, role
    FROM users
    ORDER BY id
  `);
    return result.rows;
};
const getUserById = async (id) => {
    const result = await db_1.pool.query(`SELECT id, name, email, phone, role FROM users WHERE id = $1`, [id]);
    return result.rows[0] || null;
};
const updateUser = async (id, payload) => {
    const existing = await getUserById(id);
    if (!existing)
        return null;
    const updated = {
        name: payload.name ?? existing.name,
        email: payload.email?.toLowerCase() ?? existing.email,
        phone: payload.phone ?? existing.phone,
        role: payload.role ?? existing.role,
    };
    const result = await db_1.pool.query(`
    UPDATE users
    SET name = $1, email = $2, phone = $3, role = $4
    WHERE id = $5
    RETURNING id, name, email, phone, role
    `, [updated.name, updated.email, updated.phone, updated.role, id]);
    return result.rows[0];
};
const deleteUser = async (id) => {
    const activeBookings = await db_1.pool.query(`SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`, [id]);
    if (activeBookings.rows.length > 0) {
        throw new Error("User cannot be deleted because they have active bookings");
    }
    const result = await db_1.pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0] || null;
};
exports.userService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
