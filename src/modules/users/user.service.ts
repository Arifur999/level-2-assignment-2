import bcrypt from "bcryptjs"
import { pool } from "../../config/db";
import { CreateUserPayload } from "./auth.interface";

const createUser =async(payload:CreateUserPayload)=>{

const{name,email,phone,role,password}=payload;
const hashedPass=await bcrypt.hash(password as string,10)

 const result =await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id`,[name,email.toLowerCase(),hashedPass,phone,role]);
   return result;


}

export const userService={
    createUser,
}