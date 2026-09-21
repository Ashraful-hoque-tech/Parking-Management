# 🚗 Smart Parking Lot Management System

A backend-focused parking lot management system built with **Node.js, Express.js, MongoDB, and Mongoose**.

The project was built as a hands-on exercise to understand **backend business logic**, database operations, API design, validation, service/controller separation, and error handling.

Instead of focusing on authentication or frontend development, the project focuses primarily on modeling and implementing real-world parking rules.

---

## 🎯 Project Objective

The goal of this project is to simulate the backend of a parking lot where vehicles can:

* Enter the parking lot
* Automatically receive an appropriate parking slot
* Be prevented from entering twice
* Exit the parking lot
* Have parking fees calculated automatically
* Release their parking slot after exit
* Be searched while currently parked
* Show current parking duration
* Provide a real-time parking capacity summary

---

## 🛠️ Tech Stack

* **JavaScript**
* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **express-validator**
* **Postman** for API testing

---

## 📁 Project Structure

```text
parking-project/
│
├── src/
│   │
│   ├── controllers/
│   │   └── parking.controller.js
│   │
│   ├── models/
│   │   ├── parking.model.js
│   │   └── parkingSlot.model.js
│   │
│   ├── routes/
│   │   └── parking.routes.js
│   │
│   ├── services/
│   │   └── parking.service.js
│   │
│   └── validators/
│       └── parking.validator.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚘 Core Features

## 1. Vehicle Entry

A vehicle can enter the parking lot by providing:

```json
{
  "vehicleNumber": "bike2",
  "vehicleType": "bike"
}
```

The system:

1. Checks whether the vehicle is already parked.
2. Searches for an available slot matching the vehicle type.
3. Assigns the available slot.
4. Marks the slot as occupied.
5. Creates a parking record.

Example:

```text
bike2 → B2
```

---

## 2. Vehicle-Type Based Slot Allocation

The parking lot supports three vehicle types:

```text
bike
car
bus
```

Each vehicle can only be assigned a slot designed for its type.

Example:

```text
Bike → B1/B2/B3
Car  → C1/C2
Bus  → BU1/BU2
```

A car cannot occupy a bike slot simply because that slot is available.

---

## 3. Duplicate Vehicle Prevention

A vehicle that is already parked cannot enter again.

Example:

```text
bike2 enters
      ↓
B2 assigned
      ↓
bike2 tries to enter again
      ↓
Request rejected
```

This is implemented as a business rule rather than simple request validation.

---

## 4. Automatic Slot Allocation

The system automatically finds an available slot using:

```text
vehicleType
+
status = available
```

Example:

```text
Available:
B1
B2
B3

Bike enters

→ B1 assigned
→ B1 becomes occupied
```

The client does not manually choose a slot.

---

## 5. Vehicle Exit

When a vehicle exits, the system:

1. Finds the parking record.
2. Finds the assigned parking slot.
3. Calculates the parking fee.
4. Deletes the parking record.
5. Releases the parking slot.

After exit:

```text
Occupied → Available
```

---

# 💰 Parking Fare Calculation

The system calculates parking fees based on:

* Vehicle type
* Parking duration

### Pricing

| Vehicle | First Hour | Additional Hour |
| ------- | ---------: | --------------: |
| Bike    |        ₹20 |             ₹15 |
| Car     |        ₹50 |             ₹30 |
| Bus     |       ₹100 |             ₹70 |

The system uses `Math.ceil()` for billable hours.

For example:

```text
Car parked for 1 hour 10 minutes

→ Billable duration = 2 hours

→ ₹50 + ₹30
→ ₹80
```

Fare calculation is handled inside the **service layer** rather than directly inside the controller.

---

# 🔎 Vehicle Search

A currently parked vehicle can be searched using its vehicle number.

```http
GET /api/parking/vehicle/:vehicleNumber
```

Example:

```http
GET /api/parking/vehicle/bike2
```

Example response:

```json
{
  "message": "Vehicle found",
  "data": {
    "vehicleNumber": "bike2",
    "vehicleType": "bike",
    "slotId": "B2",
    "parkedAt": "2026-09-21T18:39:33.198Z",
    "duration": {
      "hours": 2,
      "minutes": 35
    }
  }
}
```

The parking duration is calculated dynamically from the vehicle's parking time and the current time.

---

# 📊 Parking Status

The system provides an overall parking capacity summary.

```http
GET /api/parking/status
```

Example response:

```json
{
  "totalSlots": 7,
  "occupiedSlots": 3,
  "availableSlots": 4,
  "byVehicleType": {
    "bike": {
      "total": 3,
      "occupied": 2,
      "available": 1
    },
    "car": {
      "total": 2,
      "occupied": 1,
      "available": 1
    },
    "bus": {
      "total": 2,
      "occupied": 0,
      "available": 2
    }
  }
}
```

This allows the parking system to determine how much capacity remains without manually inspecting individual records.

---

# ✅ Request Validation

The project uses **express-validator** for request-level validation.

Validation includes:

### Vehicle Number

* Required
* Must be a string

### Vehicle Type

* Required
* Must be one of:

```text
bike
car
bus
```

Example invalid request:

```json
{
  "vehicleNumber": "bike2",
  "vehicleType": "truck"
}
```

The request is rejected before reaching the business logic.

---

# ⚠️ Error Handling

The API handles several common failure cases.

| Situation                  | Response                    |
| -------------------------- | --------------------------- |
| Missing vehicle number     | `400 Bad Request`           |
| Invalid vehicle type       | `400 Bad Request`           |
| Vehicle already parked     | `400 Bad Request`           |
| No suitable slot available | `400 Bad Request`           |
| Vehicle not found          | `404 Not Found`             |
| Database/server error      | `500 Internal Server Error` |

Database operations are wrapped with `try/catch` blocks in the controllers.

---

# 🔌 API Endpoints

## Vehicle Entry

```http
POST /api/parking
```

### Request

```json
{
  "vehicleNumber": "bike2",
  "vehicleType": "bike"
}
```

---

## Vehicle Exit

```http
DELETE /api/parking
```

### Request

```json
{
  "vehicleNumber": "bike2"
}
```

---

## Parking Status

```http
GET /api/parking/status
```

---

## Find Vehicle

```http
GET /api/parking/vehicle/:vehicleNumber
```

Example:

```http
GET /api/parking/vehicle/bike2
```

---

# 🧠 Business Rules

The main business rules implemented in the project are:

### Rule 1 — Vehicle cannot be parked twice

```text
Already parked → Reject entry
```

### Rule 2 — Vehicle must receive a compatible slot

```text
Bike → Bike slot
Car  → Car slot
Bus  → Bus slot
```

### Rule 3 — No available slot means no entry

```text
No compatible slot → Reject entry
```

### Rule 4 — Exiting vehicle must actually be parked

```text
Vehicle not found → Reject exit
```

### Rule 5 — Exiting a vehicle releases its slot

```text
Vehicle exits → Slot becomes available
```

### Rule 6 — Fare depends on vehicle type and duration

```text
Vehicle type + Parking duration → Fare
```

---

# 🧩 Architecture

The project follows a simple layered backend structure:

```text
                 HTTP Request
                      │
                      ▼
                   Routes
                      │
                      ▼
                 Controllers
                      │
                      ▼
                  Services
                      │
                      ▼
                   Models
                      │
                      ▼
                   MongoDB
```

### Routes

Responsible for defining API endpoints.

### Controllers

Responsible for:

* Receiving requests
* Reading parameters/body
* Calling services
* Returning HTTP responses
* Handling controller-level errors

### Services

Responsible for:

* Business logic
* Fare calculation
* Parking status calculations
* Vehicle lookup

### Models

Responsible for defining MongoDB document structures.

### Validators

Responsible for validating incoming request data.

---

# 🗄️ Database Models

## Parking Slot

Each slot contains information such as:

```text
slotId
vehicleType
status
```

Example:

```json
{
  "slotId": "B2",
  "vehicleType": "bike",
  "status": "occupied"
}
```

---

## Parking Record

A parking record contains:

```text
vehicleNumber
vehicleType
slotId
parkedAt
```

Example:

```json
{
  "vehicleNumber": "bike2",
  "vehicleType": "bike",
  "slotId": "B2",
  "parkedAt": "2026-09-21T18:39:33.198Z"
}
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

## 2. Navigate into the project

```bash
cd parking-project
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

## 5. Start the server

Depending on your `package.json` scripts:

```bash
npm start
```

or:

```bash
npm run dev
```

The server should start on:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

The project uses environment variables for sensitive configuration.

Example `.env.example`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

The actual `.env` file should **never be committed to GitHub**.

---

# 🧪 Testing

The API was tested using **Postman**.

Important test scenarios include:

```text
✓ Vehicle entry
✓ Duplicate vehicle entry
✓ Correct slot allocation
✓ No available slot
✓ Vehicle exit
✓ Vehicle not found
✓ Fare calculation
✓ Slot release
✓ Vehicle search
✓ Parking duration
✓ Parking capacity summary
✓ Invalid vehicle type
✓ Missing required fields
✓ Database failure
```

---

# 📚 What I Learned

This project was primarily built to strengthen backend problem-solving and business-logic skills.

Through the project, I practiced:

* REST API design
* Express.js routing
* Controllers and services
* MongoDB CRUD operations
* Mongoose models
* Querying MongoDB with conditions
* Request validation
* Business-rule implementation
* HTTP status codes
* Error handling
* Date/time calculations
* Database-driven state management
* Separation of concerns
* Debugging backend applications
* API testing with Postman

---

# 🚀 Future Improvements

Possible future improvements could include:

* Authentication and authorization
* Admin/parking-manager roles
* Payment integration
* Parking history
* Multiple parking locations
* Advanced reporting
* Global error-handling middleware
* MongoDB transactions for atomic operations
* Automated tests
* API documentation with Swagger/OpenAPI
* Docker deployment
* Frontend dashboard

These are intentionally outside the current scope of the project.

---

# 👨‍💻 Project Purpose

This project was built as a **backend business-logic learning project**.

The focus was not on creating a large production system, but on understanding how backend developers translate real-world rules into:

```text
Requirements
     ↓
Business Rules
     ↓
Database Operations
     ↓
Service Logic
     ↓
API Responses
```

---

## 📄 License

This project is for learning and educational purposes.
