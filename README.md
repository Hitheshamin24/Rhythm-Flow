# RhythmFlow

> **A centralized Dance Studio Management System** — built to help admins seamlessly manage students, track attendance, handle fee payments, and monitor financials all in one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dncr.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://dncr.vercel.app/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

---

## About the Project

**RhythmFlow** is a full-stack web application designed specifically for dance studio administrators. It eliminates the need for scattered spreadsheets and manual record-keeping by providing a single, efficient platform to:

- **Manage Student Data** — Add, update, and view student profiles with all relevant details
- **Track Attendance** — Mark and monitor student attendance across classes and sessions
- **Handle Fee Payments** — Record and manage fee transactions for each student
- **Monitor Financial Records** — Get a clear overview of revenue, dues, and payment history

---

## Live Demo

The application is live and accessible at:

 **[https://dncr.vercel.app/](https://dncr.vercel.app/)**

No installation required — just open the link in your browser and get started.

---

## Tech Stack

RhythmFlow is built using the **MERN** stack:

| Technology | Role |
|------------|------|
| **MongoDB** | Database — stores student, attendance, and financial data |
| **Express.js** | Backend framework — handles API routes and business logic |
| **React.js** | Frontend — dynamic and responsive UI |
| **Node.js** | Runtime — powers the backend server |

---

## Project Structure

```
RhythmFlow/
├── backend/                  # Express.js + Node.js API server
│   ├── config/               # Database and app configuration
│   ├── middleware/           # Custom middleware (auth, error handling, etc.)
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # API route definitions
│   ├── utils/                # Utility/helper functions
│   ├── .env                  # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js             # Entry point for the backend
│
└── frontend/                 # React.js + Vite client application
    ├── public/               # Static assets
    ├── src/                  # React source code
    ├── index.html            # HTML entry point
    ├── eslint.config.js
    ├── vite.config.js        # Vite configuration
    ├── vercel.json           # Vercel deployment config
    └── package.json
```

---

## Running Locally

Follow these steps to run RhythmFlow on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Hitheshamin24/RhythmFlow.git
cd RhythmFlow
```

---

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend will run at **`http://localhost:5000`**

---

### Step 3 — Set Up the Frontend

Open a **new terminal**, then:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder (if needed):

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend will run at **`http://localhost:5173`**

---

### Step 4 — Open in Browser

Visit **[http://localhost:5173](http://localhost:5173)** in your browser to use RhythmFlow locally.

> Make sure both the **backend** and **frontend** servers are running simultaneously in separate terminals.

---

## Features

- Admin authentication and secure login
- Full student profile management (add, edit, delete)
- Attendance tracking per class/session
- Fee payment recording and history
- Financial dashboard and reporting
- Responsive UI for desktop and mobile

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is for educational purposes only.

---

## Author

**Hitheshamin24**
- GitHub: [@Hitheshamin24](https://github.com/Hitheshamin24)

---