# User Management API

## 📌 Project Overview

This is a RESTful API built using Node.js and Express for managing users.
It supports full CRUD operations along with search and sorting functionality.

---

## 🚀 Setup & Run Instructions

### 1. Clone the repository

git clone https://github.com/your-username/user-management-api.git

### 2. Navigate to the project directory

cd user-management-api

### 3. Install dependencies

npm install

### 4. Start the server

node src/app.js

---

## 🌐 Server

The server will run at:
http://localhost:3000

---

## 📡 API Endpoints

### 🔹 GET /users

* Fetch all users
* Supports query parameters:

  * `?search=` → Search users by name
  * `?sort=name&order=asc` → Sort users

---

### 🔹 GET /users/:id

* Fetch a single user by ID

---

### 🔹 POST /users

* Create a new user

Example Request Body:
{
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)"
}

---

### 🔹 PUT /users/:id

* Update an existing user

---

### 🔹 DELETE /users/:id

* Delete a user

---

## 🧠 Features

* Create, Read, Update, Delete (CRUD)
* Search functionality
* Sorting support
* Clean and modular architecture
* Error handling middleware
* Basic validation

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* SQLite / In-memory storage

---

## ⚠️ Assumptions

* Only basic fields (name, email) are used
* No authentication implemented
* Designed for demonstration purposes

---

## 📌 Notes

* The project follows a layered architecture (Routes → Controllers → Services → Database)
* Easily extendable for future enhancements

---

## 👨‍💻 Author

Sannapuri gayatri rani
