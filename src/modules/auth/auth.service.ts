// src/modules/auth/auth.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";
import { SignupPayload, SigninPayload } from "./auth.interface";

const signup = async (payload: SignupPayload) => {
  const { name, email, password, phone, role } = payload;

  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    throw new Error("Email already in use");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );


  return result.rows[0];
};

const signin = async (payload: SigninPayload) => {
  const { email, password } = payload;


  const result = await pool.query(
    `
    SELECT id, name, email, phone, role, password
    FROM users
    WHERE email = $1
    `,
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // password check
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }


  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt_secret,
    { expiresIn: "7d" }
  );

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

export const authService = {
  signup,
  signin,
};
