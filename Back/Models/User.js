import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: Number },
    age: { type: Number },
    verified: { type: Boolean, default: false },
    profile_image: { type: String, default: "" },
    last_login: { type: Date },
    reset_token: { type: String },
    reset_token_expiry: { type: Date },
    is_active: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
