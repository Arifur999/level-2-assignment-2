"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const config_1 = __importDefault(require("../../config"));
const signup = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const existing = await db_1.pool.query(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase()]);
    if (existing.rows.length > 0) {
        throw new Error("Email already in use");
    }
    const hashedPass = await bcryptjs_1.default.hash(password, 10);
    const result = await db_1.pool.query(`
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `, [name, email.toLowerCase(), hashedPass, phone, role]);
    return result.rows[0];
};
const signin = async (payload) => {
    const { email, password } = payload;
    const result = await db_1.pool.query(`
    SELECT id, name, email, phone, role, password
    FROM users
    WHERE email = $1
    `, [email.toLowerCase()]);
    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }
    const user = result.rows[0];
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role,
    }, config_1.default.jwt_secret, { expiresIn: "7d" });
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
    return {
        token,
        user: safeUser,
    };
};
exports.authService = {
    signup,
    signin,
};
