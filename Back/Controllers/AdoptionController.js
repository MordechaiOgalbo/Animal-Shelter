import AdoptionApplication from "../Models/AdoptionApplication.js";
import Animal from "../Models/Animal.js";
import Notification from "../Models/Notification.js";
import User from "../Models/User.js";

const ensureHasReviewNotification = async (userId, applicationId) => {
  const n = await Notification.findOne({
    recipient: userId,
    deleted: false,
    "data.applicationId": applicationId.toString(),
  }).select("_id");
  return !!n;
};

export const submitAdoptionApplication = async (req, res) => {
  try {
    const { animalId } = req.params;

    const {
      full_name,
      email,
      phone,
      preferred_contact,
      monthly_income,
      home_environment,
      household_members,
      work_schedule,
      has_other_animals,
      other_animals_details,
      health_condition,
      health_details,
      experience_with_animals,
      reason_for_adoption,
      additional_notes,
    } = req.body || {};

    if (!full_name || !email || !phone || !home_environment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ error: "Animal not found" });

    const application = await AdoptionApplication.create({
      animal: animal._id,
      applicant_user: req.userId || null,
      full_name,
      email,
      phone,
      preferred_contact: preferred_contact || "phone",
      monthly_income: monthly_income || "",
      home_environment: home_environment || "",
      household_members: household_members || "",
      work_schedule: work_schedule || "",
      has_other_animals: has_other_animals || "no",
      other_animals_details: other_animals_details || "",
      health_condition: health_condition || "none",
      health_details: health_details || "",
      experience_with_animals: experience_with_animals || "",
      reason_for_adoption: reason_for_adoption || "",
      additional_notes: additional_notes || "",
      status: "submitted",
    });

    // Recipients:
    // - If animal.submitted_by exists -> that user
    // - Else -> all staff/admin
    let recipients = [];
    if (animal.submitted_by) {
      recipients = [animal.submitted_by];
    } else {
      const staff = await User.find({ role: { $in: ["staff", "admin"] } }).select("_id");
      recipients = staff.map((u) => u._id);
    }

    const animalName = animal.name || "Animal";
    const title = `New adoption application: ${animalName}`;
    const message = `${full_name} submitted an adoption application.`;
    const link = `/review/${application._id}`; // review page

    if (recipients.length > 0) {
      await Notification.insertMany(
        recipients.map((recipient) => ({
          recipient,
          type: "adoption_application",
          title,
          message,
          link,
          data: {
            applicationId: application._id.toString(),
            animalId: animal._id.toString(),
            animalName,
            applicantName: full_name,
            applicantEmail: email,
            applicantPhone: phone,
          },
        }))
      );
    }

    return res.status(201).json({
      message: "Application submitted",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("submitAdoptionApplication error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getApplicationForReview = async (req, res) => {
  try {
    const { id } = req.params; // application id

    const allowed = await ensureHasReviewNotification(req.userId, id);
    if (!allowed) return res.status(403).json({ error: "Not allowed" });

    const application = await AdoptionApplication.findById(id)
      .populate("animal")
      .populate("applicant_user", "user_name email phone_number profile_image profile_color profile_text_color");

    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json({ application });
  } catch (error) {
    console.error("getApplicationForReview error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const decideApplication = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const { decision, rejection_reason, message_to_applicant } = req.body || {};

    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({ error: "Invalid decision" });
    }

    const allowed = await ensureHasReviewNotification(req.userId, id);
    if (!allowed) return res.status(403).json({ error: "Not allowed" });

    const application = await AdoptionApplication.findById(id).populate("animal");
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.decision = decision;
    application.status = decision;
    application.reviewed_by = req.userId;
    application.reviewed_at = new Date();
    application.rejection_reason = decision === "rejected" ? (rejection_reason || "") : "";
    application.message_to_applicant = message_to_applicant || "";
    await application.save();

    // If accepted, mark animal as adopted
    if (decision === "accepted" && application.animal) {
      application.animal.adopted = true;
      application.animal.adopted_by = application.applicant_user || null;
      application.animal.adopted_at = new Date();
      await application.animal.save();
    }

    // Notify applicant (only if they were logged in user)
    if (application.applicant_user) {
      const animalName = application.animal?.name || "Animal";
      const title =
        decision === "accepted"
          ? `Adoption application accepted: ${animalName}`
          : `Adoption application rejected: ${animalName}`;
      const message =
        decision === "accepted"
          ? (message_to_applicant || "Your adoption application was accepted.")
          : (message_to_applicant || "Your adoption application was rejected.");

      const decisionNotif = await Notification.create({
        recipient: application.applicant_user,
        type: "adoption_decision",
        title,
        message,
        link: "", // Will be set after creation
        data: {
          applicationId: application._id.toString(),
          animalId: application.animal?._id?.toString(),
          animalName,
          decision,
          rejection_reason: application.rejection_reason,
          message_to_applicant: message_to_applicant || "",
        },
      });
      
      // Update link with the actual notification ID
      decisionNotif.link = `/notification/${decisionNotif._id}`;
      await decisionNotif.save();
    }

    res.json({ message: "Decision saved", applicationId: application._id, decision });
  } catch (error) {
    console.error("decideApplication error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

