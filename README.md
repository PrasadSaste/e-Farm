# 🌱 E-FARM — Smart Agriculture Management System

Full-stack web application connecting farmers, buyers, and suppliers.

## Tech Stack
- **Frontend**: React 18, React Router, Axios, Recharts
- **Backend**: Node.js, Express.js, JWT Auth
- **Database**: MongoDB + Mongoose

## Folder Structure
```
efarm/
├── frontend/       # React App
├── backend/        # Node.js + Express API
└── database/       # MongoDB seed data & schema docs
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run seed           # seed sample data
npm run dev            # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start              # runs on http://localhost:3000
```

## Modules
1. Farmer Registration & Profile
2. Crop Lifecycle Management
3. Market & E-Commerce
4. Weather & Alerts
5. Government Schemes
6. Analytics & Reports
7. Admin Panel
