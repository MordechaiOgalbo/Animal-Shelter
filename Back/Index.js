import express from "express";
import dotenv from "dotenv";
import animalRouter from "./Routers/AnimalRoutes.js";
import authRouter from "./Routers/AuthsRoutes.js";
import userRouter from "./Routers/UserRoutes.js";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
