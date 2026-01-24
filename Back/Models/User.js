import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String },
    age: { type: Number },
    verified: { type: Boolean, default: false },
    profile_image: { type: String, default: "" },
    profile_color: { type: String, default: "#3bab7e" },
    profile_text_color: { type: String, default: "#ffffff" },
    bio: { type: String, default: "" },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip_code: { type: String },
      country: { type: String },
    },
    adoption_history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
    last_login: { type: Date },
    reset_token: { type: String },
    reset_token_expiry: { type: Date },
    is_active: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "staff", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
