# University Management System - Backend

This is the backend API for the **University Management System**, built using the MERN stack. It handles user authentication, role-based access control, and CRUD operations for courses and academic programs.

## 🚀 Features

- 🔑 Secure authentication with JWT & bcrypt
- 🏫 Role-based access control (Admin, Faculty, Student)
- 📚 CRUD operations for users, courses, and programs
- 📊 RESTful API with Express.js
- 📦 MongoDB database with Mongoose ODM

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing

## ⚡ Getting Started

### Prerequisites

Make sure you have **Node.js**, **npm**, and **MongoDB** installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/university-management-backend.git
   cd university-management-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/universityDB
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### 📜 API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/users`         | Get all users       |
| POST   | `/api/courses`       | Add a new course    |
| GET    | `/api/courses`       | Get all courses     |
| PUT    | `/api/courses/:id`   | Update a course     |
| DELETE | `/api/courses/:id`   | Delete a course     |

## 📜 Folder Structure

```
/src
  ├── builder/         # Query Builder
  ├── config/         # Database configuration
  ├── constant/         # Type configuration
  ├── DB/               # Database configuration
  ├── errors/           # Error Handler
  ├── interface/           # Interface configuration
  ├── controllers/    # Route controllers
  ├── middleware/     # Authentication and authorization
  ├── models/        # Mongoose schemas
  ├── routes/        # API endpoints
  ├── utils/         # Utility functions
  ├── server.js      # Entry point
```

## 🚀 Deployment

To run in production mode:

```bash
npm start
```

## 👨‍💻 Contributors

- [Nur A Asraful Khan](https://github.com/NA-Asraful-Khan)

## 📜 License

This project is licensed under the MIT License.
