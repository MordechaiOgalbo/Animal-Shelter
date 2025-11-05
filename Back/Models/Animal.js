import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String },
    animal: { type: String },
    breed: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    age: { type: Number, min: 0 },
    life_expectancy: {
      captivity: { type: String },
      wild: { type: String },
    },
    medical_condition: { type: String },
    tameness_level: { type: String },
    care_requirements: {
      food: { type: String },
      attention: { type: String },
      yearly_cost: { type: String },
      average_vet_cost: { type: String },
      insurance: { type: String },
    },
    adoption_type: { type: String, enum: ["Permanent", "Foster"] },
    foster_duration: { type: String, default: "" },
    address: { type: String },
    img: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Animal", AnimalSchema);
