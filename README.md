# ExpenseTracker Pro

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

A full-stack **MERN** personal expense tracker with authentication, budgets, category analytics, receipt uploads, and a rule-based spending-insights engine.

> **Honesty note on scope:** this is a genuinely working full-stack app covering every core module (auth, expenses, income, budgets, dashboard, charts, dark mode, responsive UI). Two items from the original spec are simplified rather than "full production-grade": **AI Insights** are computed with real data-driven heuristics (not a trained ML model), and **Reports** export as CSV out of the box (PDF/Excel export can be added with `jspdf`/`exceljs` if you need it — see Roadmap).

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Postman Collection](#postman-collection)
- [MongoDB Atlas Setup](#mongodb-atlas-setup-guide)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

**Authentication**
- Register / Login / Logout, JWT access + refresh tokens (httpOnly cookie), protected routes, bcrypt password hashing, profile update, change password.

**Expenses**
- Add / edit / delete, receipt upload to Cloudinary, search, category filter, sort, pagination.

**Income**
- Add / edit / delete, search, pagination.

**Dashboard**
- Current balance, total income/expense, this month's savings, monthly summary, recent transactions.

**Charts**
- Pie chart (expense by category), bar chart (monthly expense), line chart (income vs expense trend).

**Budget**
- Create/edit/delete monthly per-category budgets, live progress bars, toast alert when a threshold is crossed.

**Reports**
- Category & monthly breakdown, CSV export.

**AI-style Insights**
- Highest spending category, month-over-month comparison, savings rate, end-of-month spend projection — all computed live from your real aggregated data.

**UX**
- Toast notifications, dark mode, fully responsive (mobile / tablet / desktop), loading skeletons, custom 404 page.

---

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, React Hook Form, React Toastify, Chart.js / react-chartjs-2, lucide-react

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, cookie-parser, cors, dotenv, multer, Cloudinary

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

---

## Folder Structure

```
expense-tracker/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Common/          # Button, Loader, Modal, SearchBar, Pagination
│   │   │   ├── Charts/          # ExpensePieChart, MonthlyBarChart, IncomeExpenseLineChart
│   │   │   ├── Navbar.jsx, Sidebar.jsx, DashboardCards.jsx
│   │   │   ├── ExpenseTable.jsx, IncomeTable.jsx, ProfileCard.jsx, ProtectedRoute.jsx
│   │   ├── pages/                # Login, Register, Dashboard, Expenses, Income, Budget, Reports, Profile, Settings, NotFound
│   │   ├── layouts/               # DashboardLayout, AuthLayout
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/            # authSlice, expenseSlice, incomeSlice, budgetSlice
│   │   ├── services/api.js        # Axios instance + refresh-token interceptor
│   │   ├── utils/                 # constants, helpers, validators
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, vite.config.js, tailwind.config.js, postcss.config.js, package.json
│
├── server/                      # Express backend (MVC)
│   ├── config/                   # db.js, cloudinary.js
│   ├── controllers/              # auth, expense, income, budget, dashboard
│   ├── middlewares/              # authMiddleware, errorMiddleware, uploadMiddleware
│   ├── models/                   # User, Expense, Income, Budget
│   ├── routes/                   # authRoutes, expenseRoutes, incomeRoutes, budgetRoutes, dashboardRoutes
│   ├── utils/                    # generateToken, validators
│   ├── server.js, package.json
│
├── postman/ExpenseTrackerPro.postman_collection.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- A Cloudinary account (for receipt uploads)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd expense-tracker

# Backend
cd server
npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../client
npm install
cp .env.example .env   # fill in your values
```

### 2. Run in development
```bash
# Terminal 1 - backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 - frontend (http://localhost:5173)
cd client
npm run dev
```

### 3. Build for production
```bash
cd client
npm run build   # outputs client/dist
```

---

## Environment Variables

### `server/.env`
| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | Access token lifetime, e.g. `15m` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for receipt uploads |
| `CLIENT_URL` | Frontend origin, used for CORS |

### `client/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, returns access token + refresh cookie |
| POST | `/auth/logout` | Private | Clears refresh token |
| POST | `/auth/refresh` | Cookie | Issues a new access token |
| GET | `/auth/profile` | Private | Get current user |
| PUT | `/auth/profile` | Private | Update name / currency / dark mode |
| PUT | `/auth/change-password` | Private | Change password |

### Expenses (`/expenses`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/expenses?search=&category=&startDate=&endDate=&sortBy=&order=&page=&limit=` | List, search, filter, sort, paginate |
| GET | `/expenses/:id` | Get single expense |
| POST | `/expenses` (multipart, field `receipt` optional) | Create |
| PUT | `/expenses/:id` (multipart) | Update |
| DELETE | `/expenses/:id` | Delete |

### Income (`/income`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/income` | List, search, paginate |
| POST | `/income` | Create |
| PUT | `/income/:id` | Update |
| DELETE | `/income/:id` | Delete |

### Budget (`/budget`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/budget?month=&year=` | List budgets with live spend/progress |
| POST | `/budget` | Create |
| PUT | `/budget/:id` | Update |
| DELETE | `/budget/:id` | Delete |

### Dashboard (`/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Balance, totals, monthly summary, category breakdown, recent transactions, monthly trend, AI insights |

All private routes require `Authorization: Bearer <accessToken>`.

---

## Postman Collection

Import [`postman/ExpenseTrackerPro.postman_collection.json`](./postman/ExpenseTrackerPro.postman_collection.json) into Postman. Set the `baseUrl` variable and, after logging in, paste the returned `accessToken` into the `accessToken` collection variable.

---

## MongoDB Atlas Setup Guide

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Cluster** (the free M0 tier is fine).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add your IP (or `0.0.0.0/0` for development/testing).
5. Click **Connect → Drivers**, copy the connection string, and replace `<username>`, `<password>`, and the database name — paste it into `server/.env` as `MONGO_URI`.

---

## Deployment

### Backend → Render
1. Push your repo to GitHub.
2. In Render, create a **New Web Service**, connect the repo, set the root directory to `server`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add all `server/.env` variables under **Environment**.
5. Deploy — Render gives you a public URL like `https://your-api.onrender.com`.

### Frontend → Vercel
1. In Vercel, **Import Project**, set the root directory to `server/client`.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Add `VITE_API_URL` pointing at your Render backend URL + `/api`.
4. Deploy.
5. Update `CLIENT_URL` in your Render backend env to the Vercel domain (for CORS), then redeploy the backend.

---

## Screenshots

> Screenshot placeholders — add real captures after running the app locally.

| Dashboard | Expenses | Budget |
|---|---|---|
| `docs/screenshots/dashboard.png` | `docs/screenshots/expenses.png` | `docs/screenshots/budget.png` |

---

## Roadmap
- [ ] PDF export for Reports (via `jspdf` + `jspdf-autotable`)
- [ ] Excel export for Reports (via `exceljs`)
- [ ] True ML-based spending predictions (currently rule-based heuristics on real aggregated data)
- [ ] Multi-currency conversion
- [ ] Recurring transactions

## License
MIT — see [LICENSE](./LICENSE).
