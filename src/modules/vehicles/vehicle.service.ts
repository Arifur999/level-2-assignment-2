import { pool } from "../../config/db";
import { CreateVehiclePayload } from "./vehicle.interface";


const createVehicle =async(payload:CreateVehiclePayload)=>{

const{vehicle_name,type,registration_number,daily_rent_price,availability_status}=payload;


 const result =await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
   return result;


}

export const vehicleService={
    createVehicle,
}