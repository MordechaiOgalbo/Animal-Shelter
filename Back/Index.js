import express from "express";
import dotenv from "dotenv";
import animalRouter from "./Routers/AnimalRoutes.js";
import authRouter from "./Routers/AuthsRoutes.js";
import userRouter from "./Routers/UserRoutes.js";
import adoptionRouter from "./Routers/AdoptionRoutes.js";
import notificationRouter from "./Routers/NotificationRoutes.js";
import adminRouter from "./Routers/AdminRoutes.js";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// ----- Setup __dirname in ES Modules -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Load environment variables from .env -----
dotenv.config();

const app = express();

// ----- Allowed origins for CORS -----
const allowedOrigins = [
  "http://localhost:5173", // local frontend (dev)
  "https://animal-shelter-2.onrender.com", // deployed frontend (Render)
];

// ----- CORS middleware -----
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, Postman, or some preflight requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log blocked requests for debugging
      console.log("Blocked CORS request from:", origin);
      return callback(null, false); // reject other origins without crashing
    },
    credentials: true, // allow cookies to be sent cross-origin
  }),
);

// ----- Cookie parser -----
app.use(cookieParser());

// ----- Body parser for JSON and form data (10MB limit for large images) -----
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ----- Serve uploaded files -----
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----- MongoDB connection -----
async function connectDB() {
  const url = process.env.MONGO_URL;

  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
}
connectDB();

// ----- Root route (API test) -----
app.get("/", (req, res) => {
  res.json({ message: "Animal Shelter API Server is running" });
});

// ----- API Routes -----
app.use("/api/animal", animalRouter); // Animal catalog
app.use("/api/auth", authRouter); // Login, register, logout
app.use("/api/user", userRouter); // User profile, favorites
app.use("/api/adoption", adoptionRouter); // Adoption process
app.use("/api/notifications", notificationRouter); // Notifications
app.use("/api/admin", adminRouter); // Admin panel

// ----- Start server -----
const port = process.env.PORT || 3000; // Render assigns PORT automatically
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
