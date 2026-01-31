import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, default: "general" }, // e.g. adoption_application
    title: { type: String, required: true },
    message: { type: String, default: "" },
    link: { type: String, default: "" }, // front-end route to open
    data: { type: Object, default: {} }, // { applicationId, animalId, applicantName, ... }
    read: { type: Boolean, default: false, index: true },
    read_at: { type: Date, default: null },
    deleted: { type: Boolean, default: false, index: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);

