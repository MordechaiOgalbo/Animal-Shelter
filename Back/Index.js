import express from "express";
import dotenv from "dotenv";
import animalRouter from "./Routers/AnimalRoutes.js";
import authRouter from "./Routers/AuthsRoutes.js";
import userRouter from "./Routers/UserRoutes.js";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
// Increase body size limit to handle large base64 images (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function connectDB() {
  const url = process.env.MONGO_URL;

  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}
connectDB();
app.get("/", (req, res) => {
  res.json({ message: "Animal Shelter API Server is running" });
});
app.use("/api/animal", animalRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
