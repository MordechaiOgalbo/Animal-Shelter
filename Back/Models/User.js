import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: Number },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"] },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
