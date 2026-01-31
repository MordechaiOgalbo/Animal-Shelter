import mongoose from "mongoose";

const AdoptionApplicationSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true, index: true },
    applicant_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Snapshot of applicant details (so it still exists even if user changes profile)
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferred_contact: { type: String, default: "phone" },

    monthly_income: { type: String, default: "" },
    home_environment: { type: String, default: "" },
    household_members: { type: String, default: "" },
    work_schedule: { type: String, default: "" },
    has_other_animals: { type: String, default: "no" }, // yes/no
    other_animals_details: { type: String, default: "" },
    health_condition: { type: String, default: "none" },
    health_details: { type: String, default: "" },
    experience_with_animals: { type: String, default: "" },
    reason_for_adoption: { type: String, default: "" },
    additional_notes: { type: String, default: "" },

    status: { type: String, default: "submitted", index: true }, // submitted/approved/rejected/etc

    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
    decision: { type: String, default: "pending" }, // pending/accepted/rejected
    rejection_reason: { type: String, default: "" },
    message_to_applicant: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionApplication", AdoptionApplicationSchema);

