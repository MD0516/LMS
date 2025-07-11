# 🗂️ Leave Management System (LMS) – Full Stack Project

This is a full-stack **Leave Management System** built with **React (Vite)** for the frontend and **Node.js + Express + MySQL** for the backend.

---

## 📁 Project Overview

- `client/` – React frontend (Vite)
- `server/` – Node.js backend with Express
  - `.env.example` – Template for environment variables
  - `Database/Employee_Database.sql` – MySQL DB dump

---

## 🚀 Features

- Add, update, and delete employees
- Manage departments
- Apply and view employee leaves
- Validations and user-friendly UI

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Other Tools:** Axios, dotenv

---

## 🔧 How to Setup the Project Locally

### 1. Clone the Repository

```bash
git clone <your_repo_url>
cd LMS
```

### 2. Setup the Database

1. Open MySQL Workbench.

2. Go to Server > Data Import.

3. Choose Import from Self-Contained File.

4. Select the file: server/Database.sql

5. Create a new schema (e.g., employee_db) and set it as the default target schema.

6. Click Start Import.

### 3. Configure Environment Variables

1. Navigate to the server/ folder:
   
   ```bash
   cd sever
   ```
2. Create a .env file and Copy .env.example to .env

3. Open .env and enter your MySQL credentials

4. Install Backend Dependencies
   
   ```bash
   cd server
   npm install
   npm start
   ```
5. Install Frontend Dependencies

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

🌐 Access the App

  Frontend: http://localhost:5173

  Backend API: http://localhost:3000
   
