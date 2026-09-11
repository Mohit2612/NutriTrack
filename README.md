# NutriTrack

NutriTrack is a modern, full-stack web application designed to help users monitor their daily nutrition, log water intake, track body weight, and visualize health progress. It is built strictly using the MERN stack with complete separation of concerns and an MVC-driven backend architecture.

## Features

### User Features
*   **Authentication**: Secure registration, login, and robust session validation with JWT and bcrypt.
*   **Dietary Profiling**: Users define personalized goals (Maintain Weight, Lose Weight, Build Muscle), activity levels, and macro baselines.
*   **Food Database Integration**: Dynamic searchable collection of `FoodItems` storing absolute macro values avoiding duplication.
*   **Meal Logging**: Log daily meals (Breakfast, Lunch, Dinner, Snacks) with precise portion configurations calculating precise calorie and macro loads dynamically based on exact item values.
*   **Water & Weight Tracking**: Users intuitively record their hydration and absolute scale metrics.
*   **Dashboard & Progress**: Interactive aggregated cards combining Recharts line-charts showcasing active BMI trajectories, water deficits, and chronological adherence.
*   **Smart Suggestions**: Algorithmic dietary recommendations intersecting active goal states and dynamically adjusting to protein/calorie deficits throughout the current day.

### Admin Features
*   **Secure Dashboards**: High-level statistical aggregating cards observing system activity.
*   **User Management System**: Admins execute full CRUD cycles modifying user schemas or forcibly terminating accounts safely (cannot self-terminate or drop singular last-admin).
*   **Food & Category Management**: Dynamic expansion modules allowing authenticated administrators to inject brand new globally searchable standard `FoodItems` and `Categories` actively into the user database safely.
*   **System Reporting**: Custom 7d, 30d, and 3m intervals projecting system usage across pie and bar layouts leveraging massive internal MongoDB `$group` aggregating algorithms dynamically calculating metadata quickly without overloading JSON throughput.

## Tech Stack
*   **Frontend**: React (v19.2), React Router DOM (v7), Recharts (v3), Axios, CSS (Variable-based native layout without Tailwind/Bootstrap bloat)
*   **Backend**: Node.js, Express.js (v4), Mongoose (v8), JSONWebToken (v9), bcryptjs.
*   **Database**: MongoDB (Mongoose ODMs).
*   **Bundler**: Vite (v8)

## Architecture & Folder Structure
NutriTrack adheres to fundamental MVC (Model View Controller) boundaries mapping API flow predictably.
```text
NutriTrack/
├── backend/
│   ├── config/ (Database & Environment hooks)
│   ├── controllers/ (Logic bounds resolving routes)
│   ├── middleware/ (Authentication & Global Error handling pipelines)
│   ├── models/ (Mongoose Data Schemas: User, Meal, FoodItem, Category, Water, Weight, Goal)
│   ├── routes/ (Express REST mapping points)
│   ├── utils/ (Date sanitization, goals, suggestions scripts)
│   └── tests/ (Isolated automated backend node scripts mapping API reliability)
└── frontend/
    ├── src/
    │   ├── components/ (Modular UI items: Navbars, Sidebars, Cards)
    │   ├── pages/ (Page-level routing bindings: Login, Dashboard, Admin views)
    │   ├── services/ (Axios REST mapping instance integrations)
    │   └── index.css (Global root visual variables and responsive layouts)
```

## Setup & Running the Application

Ensure you have **Node.js** and an active **MongoDB** instance (Local or Atlas) installed.

### MongoDB Configuration
Your MongoDB instance must be actively listening securely on its target port (default: 27017). Ensure a `.env` configuration file points at this URI properly in the backend directory wrapper.

### **1. Backend Setup**
```bash
cd backend
npm install
# Ensure .env is populated with MONGO_URI and JWT_SECRET
npm start      # For production standard executions
npm run dev    # For interactive iterative mapping (Requires nodemon)
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev    # Runs the local Vite dev server (usually Port 5173)
# To create the optimized deployment array:
npm run build
```

## API Overview
*   `/api/auth`: Generates authentication bearer tokens managing state.
*   `/api/users`: Manages profile generation and demographic updates resolving into custom calculations.
*   `/api/meals`: REST mappings tracking FoodItem dependencies and scaling serving capacities safely.
*   `/api/dashboard`: Aggregating hooks pulling chronological user behaviors dynamically.
*   `/api/admin/*`: Restricted backend hooks requiring validated `admin` credentials safely processing unconstrained user reads or system overwrites cleanly avoiding deadlocks.

## Authentication & Security
*   **Passwords**: Explicitly stripped in all REST returns ensuring DB leakage prevention.
*   **JWT Integrity**: Explicitly mapped across `protect` wrappers preventing unverified token processing natively across all secure channels.
*   **Role Bindings**: `.adminOnly` logic ensures `req.user.role === 'admin'` natively protecting core system metrics natively scaling without hardcoded string assumptions.

## Limitations & External Services
*   **Email Deliverability**: Password reset states currently execute mocked UI timeouts enforcing clean component scaling boundaries. SMTP transactional email architecture has purposefully been omitted to avoid unverified external network mapping requirements. 
*   **AI/Billing**: Not included, isolating core logic purely towards fundamental functional CRUD structures safely ensuring non-corrupted architectural stability.
