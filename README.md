# Real-time Collaborative Form Filling System

A full-stack web application that enables real-time, multi-user form collaboration. The platform supports dynamic form creation by administrators and seamless, concurrent form filling by users with field locking and role-based access.

---

## Live Website

**[https://filltogether.netlify.app/](https://filltogether.netlify.app/)**

* You can sign up as a **User**.
* **Admin login credentials:**

  * Email: `admin-colabforms@gmail.com`
  * Password: `admin123`

---

## Features

* Role-based authentication (Admin and User)
* Dynamic form builder with support for:

  * Text fields
  * Checkboxes
  * Radio buttons
  * Dropdowns
  * Textareas
  * Date selectors
* Required field validation on form creation and submission
* One-time submission enforcement (form closes after response)
* Field locking mechanism to prevent simultaneous edits
* Real-time synchronization using WebSockets (Socket.IO)
* Form responses stored in MongoDB
* JWT-based authentication

---

## Technologies Used

**Frontend:**

* React
* Vite
* Tailwind CSS
* Axios
* Socket.IO client

**Backend:**

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT Authentication
* Socket.IO server

---

## Project Structure

```
project-root/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── socket.js
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── main.jsx
```

---

## Setup Instructions

### Prerequisites

* Node.js and npm
* MongoDB (running locally or remote)
* Git

---

## Backend Setup

### Step 1: Navigate to the backend folder

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create a .env file

Create a `.env` file in the `backend/` directory with the following content:

```ini
MONGODB_URI=mongodb://localhost:27017/Proactively
JWT_SECRET=a4799ffaa4a83d74240d82305eec95a479b452bb681b4c98288dad017f02e8b93ceaf46f8b1fc26227eb992e27faa029df3e3a63bfb36a60378fe15c69ebd712
CLIENT_URL=http://localhost:5173
PORT=8080
```

### Step 4: Start the backend server

```bash
npm start
```

---

## Frontend Setup

### Step 1: Navigate to the frontend folder

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create a .env file

Create a `.env` file in the `frontend/` directory with the following content:

```ini
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_SOCKET_URL=http://localhost:8080
```

### Step 4: Start the frontend development server

```bash
npm run dev
```

The application will be available at: [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/auth/signup | Register new user |
| POST   | /api/auth/login  | Login and get JWT |

### Forms

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | /api/forms/create          | Create a new form (Admin)   |
| GET    | /api/forms/\:formId        | Get form by ID              |

---

## Real-time Communication (Socket.IO)

### Client Events

* `join_form` – Join a form room
* `update_field` – Update a form field's value
* `lock_field` – Lock a field from editing
* `unlock_field` – Unlock a field
* `submit_form` – Submit the completed form

### Server Broadcasts

* `field_updated` – Field value changed by another user
* `field_locked` – Field locked by another user
* `field_unlocked` – Field unlocked
* `form_closed` – Form submitted and closed for responses

---

## Validations and Edge Cases

* Form creation validates presence of field label, type, and required flag
* Submission enforces required fields before saving
* Locked fields prevent conflicting input in real time
* Forms are closed after one successful submission (no repeat entries)

---

## Design Decisions

* Socket.IO used for low-latency bi-directional communication for live collaboration
* JWT implemented for stateless and secure authentication
* MongoDB used for flexible schema handling of dynamic forms and responses
* Mongoose subdocuments simplify nested field structure and validation
* Field locking prevents race conditions and ensures data integrity

---

## How to Use

1. Start both backend and frontend servers.
2. Sign up as a user or log in using admin credentials.
3. Admins are redirected to a form builder to create and save forms.
4. Users are redirected to a join form page to enter a form code (form ID).
5. Multiple users can fill a form concurrently, with real-time updates.
6. On submission, the form becomes read-only and locked.

---

