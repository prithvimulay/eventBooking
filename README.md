# Event Booking System - Backend API

A robust, scalable backend service for an Event Booking platform. This architecture focuses on "immutable fundamentals"—specifically prioritizing strict resource management, concurrency control to prevent race conditions during ticket booking, and decoupled event-driven background processing.

## 🚀 Tech Stack
* **Runtime & Framework:** Node.js, Express.js
* **Database & ORM:** PostgreSQL (Dockerized), Prisma ORM (v7 Adapter Pattern)
* **Architecture:** Domain-driven feature modules, Event-driven background tasks

## ✨ Core Features
* **Role-Based Access Control (RBAC):** Strictly namespaced routes isolating `ORGANIZER` and `CUSTOMER` logic using custom header-based mock authentication.
* **Concurrency Control (Atomic Transactions):** Leverages Prisma `$transaction` and atomic decrements at the database level to guarantee ticket integrity and prevent double-booking under heavy load.
* **Event-Driven Background Jobs:** Utilizes Node's native `EventEmitter` to detach heavy async processing from the main HTTP thread.
  * **Task 1:** Booking Confirmation (Simulated Email)
  * **Task 2:** Event Update Notifications (Simulated broadcast to attendees)
* **Dockerized Infrastructure:** Containerized PostgreSQL database for isolated, reproducible local development.

---

## 🛠️ Getting Started

### Prerequisites
* Node.js (v18+)
* Docker Desktop (Running)
* Windows PowerShell

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5433/event_booking?schema=public"
PORT=3000
```

### 2. Infrastructure & Database Initialization
Open your PowerShell terminal and run the following commands to spin up the database and apply the schema:
```powershell
# Start the Dockerized PostgreSQL database
docker-compose up -d

# Install dependencies
npm install

# Push the schema and generate the Prisma Client
npx prisma db push
npx prisma generate
```

---

## 🧪 How to Run and Test the Application

To properly observe the background jobs and atomic transactions, follow this split-terminal testing flow.

### Step 1: Start the Server (Terminal 1)
In your primary PowerShell window, boot up the development server:
```powershell
npm run dev
```
*Leave this terminal open and visible so you can watch the `console.log` outputs trigger from the background jobs.*

### Step 2: Seed the Database (Terminal 2)
Because the database enforces strict Foreign Key constraints, we need to create dummy users before we can book events. Open a **second** PowerShell window in the project root and run this seeding script:
```powershell
node -r dotenv/config -e "const p = require('./src/config/db'); async function seed(){ await p.user.create({data:{id:'org-1', role:'ORGANIZER'}}); await p.user.create({data:{id:'cust-1', role:'CUSTOMER'}}); console.log('Users seeded!'); } seed();"
```

### Step 3: Execute the API Flow (Postman / ThunderClient)
Use an API client to simulate the user journey. **Important:** We are using mock authentication. You must include the `x-user-id` and `x-user-role` headers in every request.

#### Action A: Create an Event (As Organizer)
* **POST** `http://localhost:3000/api/organizer/events`
* **Headers:**
  * `x-user-id`: `org-1`
  * `x-user-role`: `ORGANIZER`
* **Body:**
  ```json
  {
    "title": "System Design Masterclass",
    "description": "Deep dive into scalable backend architectures.",
    "date": "2026-06-15T10:00:00Z",
    "totalTickets": 50
  }
  ```
*(Copy the generated `id` from the response for the next steps).*

#### Action B: Book a Ticket (As Customer)
* **POST** `http://localhost:3000/api/customer/bookings`
* **Headers:**
  * `x-user-id`: `cust-1`
  * `x-user-role`: `CUSTOMER`
* **Body:**
  ```json
  {
    "eventId": "<PASTE_EVENT_ID_HERE>",
    "ticketsCount": 2
  }
  ```
👉 **Check Terminal 1:** You will immediately see the background job log:
`[BACKGROUND JOB] 📧 Email Action: Sending booking confirmation...`

#### Action C: Update the Event (As Organizer)
* **PUT** `http://localhost:3000/api/organizer/events/<PASTE_EVENT_ID_HERE>`
* **Headers:**
  * `x-user-id`: `org-1`
  * `x-user-role`: `ORGANIZER`
* **Body:**
  ```json
  {
    "title": "System Design Masterclass (Rescheduled!)"
  }
  ```
👉 **Check Terminal 1:** You will see the notification engine iterate through the attendees:
`[BACKGROUND JOB] 🔔 Notification: Alerting Customer cust-1 about updates...`


