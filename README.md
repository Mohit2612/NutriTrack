# NutriTrack - Diet & Nutrition Tracker

Welcome to NutriTrack! This is a simple, beginner-friendly full-stack web application designed to help users track their daily food, calories, macronutrients, and water intake. 

## 1. What this project does
NutriTrack allows users to:
- Register and log in securely.
- Track daily food and meals (Breakfast, Lunch, Dinner, Snack).
- See a daily dashboard of total calories, protein, carbs, and fat.
- Visualize progress against a daily calorie goal.
- Track daily water intake (with an 8-glass goal).
- View a history of past meals.
- Edit their personal profile.

## 2. Technologies Used
- **Frontend**: React.js, React Router, custom CSS (no Tailwind/Bootstrap), Vite.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Authentication**: JWT (JSON Web Tokens) and bcrypt for password hashing.

## 3. Project Structure
The project is divided into two main folders:
- `backend/`: Contains the Node.js API server.
- `frontend/`: Contains the React web application.

## 4. How MVC Works in this Project
This project follows the **Model-View-Controller (MVC)** architecture on the backend:
- **Models** (`backend/models/`): Defines the shape of the data stored in MongoDB (e.g., User, Food, Water).
- **Views** (`frontend/src/`): The React application acts as the view layer, displaying data to the user.
- **Controllers** (`backend/controllers/`): Contains the logic for what happens when a user requests an API endpoint (e.g., saving food, checking a password).
- **Routes** (`backend/routes/`): Connects URLs to specific Controller functions.

## 5. How to install dependencies
1. **Backend**:
   Open a terminal, navigate to the backend folder, and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. **Frontend**:
   Open another terminal, navigate to the frontend folder, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

## 6. How to configure MongoDB
1. Ensure you have MongoDB installed locally or have a MongoDB Atlas cloud URI.
2. The default connection string in the `.env` file assumes a local MongoDB installation running on the default port `27017`.

## 7. How to create `.env`
In the `backend/` folder, a `.env` file has already been created. If it's missing, create a new file named `.env` based on `.env.example`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nutritrack
JWT_SECRET=supersecretjwtkey
```

## 8. How to start backend
In your backend terminal:
```bash
npm start
# Or using node:
node server.js
```
You should see: `Server running on port 5000` and `MongoDB Connected`.

## 9. How to start frontend
In your frontend terminal:
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to view the application.

## 10. API Endpoints
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login to an existing account
- `GET /api/dashboard` - Get today's nutrition and water summary
- `POST /api/foods` - Add a new food entry
- `GET /api/foods/today` - Get today's foods
- `DELETE /api/foods/:id` - Delete a specific food entry
- `PUT /api/water` - Add, remove, or reset water

## 11. How Data Flows
1. **React**: You click "Add Food" in the React frontend.
2. **Axios**: The React app sends an HTTP `POST` request to Express.
3. **Route**: Express receives the request at `/api/foods` and routes it to `foodController.js`.
4. **Middleware**: The `authMiddleware` checks your token to ensure you're logged in.
5. **Controller**: The `foodController` receives the food details and creates a new Mongoose document.
6. **Model & MongoDB**: The `Food` model validates the data and saves it permanently to the MongoDB database.
7. **Response**: The Controller sends a success response back to React, which then updates the UI!

## 12. How Authentication Works
When you log in, the server checks your password using `bcrypt`. If it matches, the server creates a **JWT (JSON Web Token)** and sends it back to React. React saves this token in `localStorage`. Every time React needs to get secure data (like your foods), it sends this token in the "Authorization" header. The `authMiddleware` reads the token, figures out who you are, and allows access.
