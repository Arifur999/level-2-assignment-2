🚗 Vehicle Rental System – Backend API

A Node.js + TypeScript backend API for managing a vehicle rental system with:

Vehicle inventory & availability

Customer accounts

Booking management & price calculation

Role-based authentication & authorization (Admin / Customer)

📦 Tech Stack

Runtime: Node.js, TypeScript

Framework: Express.js

Database: PostgreSQL (e.g. Neon)

Auth: JWT (jsonwebtoken)

Security: bcrypt (password hashing)

Others: cors, pg, dotenv

📁 Project Structure

Feature-based modular structure with clear separation of concerns:
```
src/
  config/
    db.ts          # PostgreSQL connection + table creation
    index.ts       # env config
  middleware/
    auth.middleware.ts  # JWT auth & role-based access
  modules/
    auth/
      auth.controller.ts
      auth.interface.ts
      auth.route.ts
      auth.service.ts
    users/
      user.controller.ts
      user.interface.ts
      user.route.ts
      user.service.ts
    vehicles/
      vehicle.controller.ts
      vehicle.interface.ts
      vehicle.route.ts
      vehicle.service.ts
    bookings/
      booking.controller.ts
      booking.interface.ts
      booking.route.ts
      booking.service.ts
  app.ts           # Express app configuration
  server.ts        # Server bootstrap (listen on PORT)

```
প্রতি module–এর ভিতরে:

route → URL & HTTP method mapping

controller → request/response handling

service → business logic & DB query

interface → TypeScript types for payloads

🗄️ Database Schema

Tables automatically created by initDB() when server starts.
```
users
Field	Type	Notes
id	SERIAL PK	Auto-generated
name	VARCHAR(100)	Required
email	VARCHAR(100)	Required, unique, lowercase
password	VARCHAR(255)	Hashed using bcrypt
phone	VARCHAR(20)	Required
role	VARCHAR(20)	admin | customer (CHECK)
vehicles
Field	Type	Notes
id	SERIAL PK	Auto-generated
vehicle_name	VARCHAR(100)	Required
type	VARCHAR(20)	car | bike | van | SUV (CHECK)
registration_number	VARCHAR(20)	Required, unique
daily_rent_price	NUMERIC(10, 2)	Required, > 0
availability_status	VARCHAR(20)	available | booked (CHECK)
bookings
Field	Type	Notes
id	SERIAL PK	Auto-generated
customer_id	INT FK	References users(id)
vehicle_id	INT FK	References vehicles(id)
rent_start_date	DATE	Required
rent_end_date	DATE	Required, must be after rent_start_date
total_price	NUMERIC(10, 2)	Required, > 0
status	VARCHAR(20)	active | cancelled | returned (CHECK)
🔐 Authentication & Authorization
User Roles

Admin

Manage users

Full access to vehicles

View & manage all bookings

Customer

Register & login

View vehicles

Create & manage own bookings
```
Auth Flow
```
Signup → POST /api/v1/auth/signup

Password hashed using bcrypt before saving.

Signin → POST /api/v1/auth/signin

On success returns a JWT token and user info.

Protected routes require header:

Authorization: Bearer <jwt_token>


Auth middleware:

Verifies JWT

Attaches { id, role } to req.user

Optionally checks allowed roles: auth("admin"), auth("admin", "customer") etc.

🌐 API Overview
Auth
Method	Endpoint	Access	Description
POST	/api/v1/auth/signup	Public	Register new user
POST	/api/v1/auth/signin	Public	Login & get JWT token
Vehicles
Method	Endpoint	Access	Description
POST	/api/v1/vehicles	Admin	Create vehicle
GET	/api/v1/vehicles	Public	Get all vehicles
GET	/api/v1/vehicles/:vehicleId	Public	Get vehicle by ID
PUT	/api/v1/vehicles/:vehicleId	Admin	Update vehicle
DELETE	/api/v1/vehicles/:vehicleId	Admin	Delete vehicle (if no active bookings)
```
Users
Method	Endpoint	Access	Description
```
GET	/api/v1/users	Admin	Get all users
PUT	/api/v1/users/:userId	Admin or Own Profile	Update user profile / role
DELETE	/api/v1/users/:userId	Admin	Delete user (if no active bookings)
Bookings
Method	Endpoint	Access	Description
POST	/api/v1/bookings	Customer / Admin	Create booking (validates availability, calculates price)
GET	/api/v1/bookings	Role-based	Admin: all bookings, Customer: own bookings
PUT	/api/v1/bookings/:bookingId	Role-based	Customer: cancel, Admin: mark as returned
```
💼 Business Logic Highlights
```
Price calculation:

number_of_days = rent_end_date - rent_start_date
total_price    = daily_rent_price * number_of_days

```
Vehicle availability:
```
On booking create → vehicle availability_status = 'booked'

On booking returned/cancelled → vehicle availability_status = 'available'
```
Deletion constraints:

Users with active bookings cannot be deleted

Vehicles with active bookings cannot be deleted

⚙️ Local Setup
1️⃣ Clone & Install
git clone <your-repo-url>
cd <project-folder>
npm install

2️⃣ Environment Variables

Root এ .env ফাইল বানাও:
```
DATABASE_URL=postgres://user:password@host:port/dbname
JWT_SECRET=your_super_secret_key
PORT=5000

3️⃣ Run in Development
npm run dev


Server usually runs at:
http://localhost:5000

4️⃣ Build & Production Run
npm run build
npm start
```
```
🧪 Testing with Postman (Examples)
Signup
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin12345",
  "phone": "01711111111",
  "role": "admin"
}

Signin
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin12345"
}

```
Response থেকে token নিয়ে protected route গুলোতে use করো:
```
Authorization: Bearer <token>
```
🚀 Deployment

Backend can be deployed to platforms like Vercel, Render, or Railway.

Env variables must be configured on the hosting platform:

DATABASE_URL

JWT_SECRET

✅ Status

 Modular architecture (auth, users, vehicles, bookings)

 PostgreSQL schema & constraints implemented

 Bcrypt password hashing

 JWT-based authentication

 Role-based authorization (admin / customer)

 All required endpoints implemented as per assignment