[Certain] The README should document the **two test accounts**, but avoid putting real MongoDB credentials or JWT secrets in it.

Note that the `.env` file is intentionally attached so you don't need to change anything besides the ``MONGO_URI``

````markdown
# Central Identity Platform

A microservices-based **Central Identity and User Management Platform** built with Node.js, Express, MongoDB, JWT, and an API Gateway.

The system provides separate services for user registration, authentication, administration, and user profile management.

---

## Architecture

```text
                    Client / Postman
                          |
                          v
                  API Gateway :5000
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   Registration       Login Service    Admin Service
      :5001               :5002            :5003
          |               |               |
          +---------------+---------------+
                          |
                          v
                    MongoDB Atlas

                    User Service
                        :5004
                          |
                          v
                    MongoDB Atlas
````

---

## Technologies

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT (JSON Web Token)
* bcryptjs
* Axios
* dotenv
* CORS
* Postman

---

## Microservices

| Service              |  Port | Purpose                                           |
| -------------------- | ----: | ------------------------------------------------- |
| API Gateway          |  5000 | Main entry point and authentication/authorization |
| Registration Service |  5001 | User registration                                 |
| Login Service        |  5002 | User authentication and JWT generation            |
| Admin Service        |  5003 | User administration                               |
| User Service         |  5004 | User profile management                           |
| MongoDB Atlas        | Cloud | Database                                          |

All client requests should go through the **API Gateway on port 5000**.

---

# Project Structure

```text
Central-Identity-Platform/
│
├── api-gateway/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── registration-service/
│   ├── config/
│   │   └── DBConnect.js
│   ├── controllers/
│   │   └── registerController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── registerRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── login-service/
│   ├── config/
│   │   └── DBConnect.js
│   ├── controllers/
│   │   └── loginController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── loginRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── admin-service/
│   ├── config/
│   │   └── DBConnect.js
│   ├── controllers/
│   │   └── adminController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── adminRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── user-service/
│   ├── config/
│   │   └── DBConnect.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Database User Model

Each user contains:

```text
_id
name
email
password
role
phone
createdAt
updatedAt
```

Passwords are hashed using **bcryptjs** before being stored in MongoDB.

---

# Test Accounts

## 1. Normal User — John

### Registration

**POST**

```text
http://localhost:5000/register/userregister
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Hello123",
  "role": "user",
  "phone": "012345678"
}
```

### Login

**POST**

```text
http://localhost:5000/auth/login
```

Body:

```json
{
  "email": "john@example.com",
  "password": "Hello123",
  "role": "user"
}
```

Copy the returned JWT token and use it for User APIs:

```text
Authorization: Bearer <JOHN_JWT_TOKEN>
```

---

# 2. Admin Account

### Registration

**POST**

```text
http://localhost:5000/register/userregister
```

Body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin123",
  "role": "admin",
  "phone": "012999999"
}
```

### Login

**POST**

```text
http://localhost:5000/auth/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "Admin123",
  "role": "admin"
}
```

Copy the returned JWT token and use it for Admin APIs:

```text
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

---

# Authentication

The Login Service generates a JWT after successful authentication.

The JWT contains:

```json
{
  "userId": "USER_ID",
  "email": "user@example.com",
  "role": "user"
}
```

The API Gateway verifies the JWT before allowing access to protected APIs.

---

# API Endpoints

## Registration

### Register User

```http
POST /register/userregister
```

Full URL:

```text
http://localhost:5000/register/userregister
```

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Hello123",
  "role": "user",
  "phone": "012345678"
}
```

Possible responses:

```text
201 Created
409 Email already registered
400 Invalid input
```

---

# Login

### User Login

```http
POST /auth/login
```

Full URL:

```text
http://localhost:5000/auth/login
```

Example:

```json
{
  "email": "john@example.com",
  "password": "Hello123",
  "role": "user"
}
```

### Admin Login

```json
{
  "email": "admin@example.com",
  "password": "Admin123",
  "role": "admin"
}
```

Successful login returns a JWT token.

---

# Admin APIs

Admin APIs require an **Admin JWT token**.

---

## 1. Search User

```http
GET /admin/searchuser
```

Example:

```text
http://localhost:5000/admin/searchuser?email=john@example.com
```

or:

```text
http://localhost:5000/admin/searchuser?name=John
```

Header:

```text
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

Possible responses:

```text
200 User found
404 No user found
400 Missing search parameter
```

---

## 2. View All Users

```http
GET /admin/viewalluser
```

Full URL:

```text
http://localhost:5000/admin/viewalluser
```

Header:

```text
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

Returns all registered users.

Passwords are excluded from the response.

---

## 3. Delete User

```http
DELETE /admin/deluser
```

Example:

```text
http://localhost:5000/admin/deluser?email=john@example.com
```

Header:

```text
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

Possible responses:

```text
200 User deleted successfully
404 User not found
400 Email is required
```

---

# User APIs

User APIs require a **User JWT token**.

A normal user can only access their own profile.

---

## 1. View Own Profile

```http
GET /user/viewprofile
```

Full URL:

```text
http://localhost:5000/user/viewprofile
```

Header:

```text
Authorization: Bearer <JOHN_JWT_TOKEN>
```

The user ID comes from the JWT, so the user can only retrieve their own profile.

---

## 2. Update Own Profile

```http
PUT /user/updateprofile
```

Full URL:

```text
http://localhost:5000/user/updateprofile
```

Header:

```text
Authorization: Bearer <JOHN_JWT_TOKEN>
```

Body:

```json
{
  "name": "John Updated",
  "phone": "012888888"
}
```

The password and email are not updated through this API.

---

# Role-Based Access Control

The API Gateway controls access based on the JWT role.

| Request           | Result             |
| ----------------- | ------------------ |
| User → User API   | Allowed            |
| User → Admin API  | `403 Forbidden`    |
| Admin → Admin API | Allowed            |
| Admin → User API  | `403 Forbidden`    |
| No token          | `401 Unauthorized` |
| Invalid token     | `401 Unauthorized` |
| Expired token     | `401 Unauthorized` |

---

# Security Features

* Passwords are hashed using bcrypt.
* Passwords are never returned by Admin/User APIs.
* JWT authentication is used for protected APIs.
* JWT expiration is enabled.
* Role-based authorization is implemented at the API Gateway.
* Admin and User APIs are separated into different microservices.
* Email addresses must be unique.
* Invalid and expired tokens are rejected.
* Users cannot access Admin APIs.
* Admins cannot access User-only APIs.

---

# Running the Project

Open **5 terminals**.

### Terminal 1 — API Gateway

```bash
cd api-gateway
npm run dev
```

Runs on:

```text
http://localhost:5000
```

### Terminal 2 — Registration Service

```bash
cd registration-service
npm run dev
```

Runs on:

```text
http://localhost:5001
```

### Terminal 3 — Login Service

```bash
cd login-service
npm run dev
```

Runs on:

```text
http://localhost:5002
```

### Terminal 4 — Admin Service

```bash
cd admin-service
npm run dev
```

Runs on:

```text
http://localhost:5003
```

### Terminal 5 — User Service

```bash
cd user-service
npm run dev
```

Runs on:

```text
http://localhost:5004
```

---

# Environment Variables

Do **not** commit `.env` files to GitHub.

Example:

```env
MONGO_URI=YOUR_MONGODB_ATLAS_URI
PORT=5001
```

Login Service:

```env
MONGO_URI=YOUR_MONGODB_ATLAS_URI
PORT=5002
JWT_SECRET=YOUR_STRONG_JWT_SECRET
JWT_EXPIRES_IN=1h
```

API Gateway:

```env
PORT=5000
REGISTRATION_SERVICE_URL=http://localhost:5001
LOGIN_SERVICE_URL=http://localhost:5002
ADMIN_SERVICE_URL=http://localhost:5003
USER_SERVICE_URL=http://localhost:5004
JWT_SECRET=YOUR_STRONG_JWT_SECRET
```

The `JWT_SECRET` used by the Login Service and API Gateway must be the same.

---

# GitHub Security

Before pushing the project to GitHub, make sure `.gitignore` contains:

```gitignore
node_modules/
.env
*.env
```

Never upload:

* MongoDB passwords
* MongoDB connection strings containing passwords
* JWT secrets
* Private API keys
* Other credentials

---

# Testing with Postman

Recommended testing order:

1. Register John
2. Register Admin
3. Login as John
4. Login as Admin
5. Test User profile API with John's token
6. Test Admin APIs with Admin token
7. Test Admin token on User API → `403`
8. Test User token on Admin API → `403`
9. Test API without token → `401`
10. Test invalid token → `401`
11. Verify data in MongoDB Atlas

---

# Expected Architecture

The project follows a microservices architecture:

```text
                   ┌───────────────┐
                   │    Postman    │
                   └───────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   API Gateway   │
                  │      :5000      │
                  │ JWT + RBAC      │
                  └───────┬─────────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
 ┌────────────┐    ┌────────────┐    ┌────────────┐
 │ Registration│    │   Login    │    │   Admin    │
 │   :5001    │    │   :5002    │    │   :5003    │
 └──────┬─────┘    └──────┬─────┘    └──────┬─────┘
        │                 │                  │
        └─────────────────┼──────────────────┘
                          │
                          ▼
                   ┌────────────┐
                   │  MongoDB   │
                   │   Atlas    │
                   └────────────┘

                  ┌────────────┐
                  │    User    │
                  │   :5004    │
                  └──────┬─────┘
                         │
                         ▼
                   ┌────────────┐
                   │  MongoDB   │
                   │   Atlas    │
                   └────────────┘
```

---

# Project Objective

The objective of this project is to demonstrate a centralized identity and user management platform using independent microservices.

The system provides:

* User registration
* User authentication
* JWT-based authentication
* Role-based authorization
* Admin user management
* User profile management
* Secure password storage
* API Gateway routing
* MongoDB database integration

