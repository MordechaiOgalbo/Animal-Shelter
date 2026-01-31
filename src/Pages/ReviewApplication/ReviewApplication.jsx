import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ReviewApplication.css";

const ReviewApplication = () => {
  const { id } = useParams(); // applicationId
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  const [messageToApplicant, setMessageToApplicant] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/adoption/applications/${id}`, {
        withCredentials: true,
      });
      setApplication(res.data.application);
      setMessageToApplicant(res.data.application?.message_to_applicant || "");
      setRejectionReason(res.data.application?.rejection_reason || "");
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to load application");
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitDecision = async (decision) => {
    if (!application) return;
    if (decision === "rejected" && !rejectionReason.trim()) {
      return toast.error("Please provide a rejection reason.");
    }

    try {
      setDecisionLoading(true);
      await axios.put(
        `http://localhost:5000/api/adoption/applications/${id}/decision`,
        {
          decision,
          rejection_reason: rejectionReason,
          message_to_applicant: messageToApplicant,
        },
        { withCredentials: true }
      );
      toast.success(`Application ${decision}.`);
      setTimeout(() => navigate("/profile"), 700);
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to save decision");
    } finally {
      setDecisionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="review-card">Loading application…</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="review-page">
        <div className="review-card">
          <p>Application not found (or you don’t have permission).</p>
          <Link className="review-link" to="/profile">
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const a = application;
  const animal = a.animal || {};

  return (
    <div className="review-page">
      <div className="review-header">
        <Link className="review-link" to="/profile">
          ← Back to Notifications
        </Link>
        <h1 className="review-title">Review Adoption Application</h1>
      </div>

      <div className="review-grid">
        <div className="review-card">
          <h2 className="review-section-title">Animal</h2>
          <div className="review-animal">
            <img
              className="review-animal-img"
              src={animal.img || "/placeholder.png"}
              alt={animal.name || "Animal"}
            />
            <div>
              <div className="review-animal-name">{animal.name || "Unnamed"}</div>
              <div className="review-animal-meta">
                {[animal.category, animal.type, animal.animal].filter(Boolean).join(" • ")}
              </div>
              {animal._id && (
                <Link className="review-animal-open" to={`/animal/${animal._id}`}>
                  Open animal page
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="review-card">
          <h2 className="review-section-title">Applicant</h2>
          <div className="review-kv">
            <div className="kv"><span>Name</span><strong>{a.full_name}</strong></div>
            <div className="kv"><span>Email</span><strong>{a.email}</strong></div>
            <div className="kv"><span>Phone</span><strong>{a.phone}</strong></div>
            <div className="kv"><span>Preferred contact</span><strong>{a.preferred_contact || "—"}</strong></div>
          </div>
        </div>

        <div className="review-card review-wide">
          <h2 className="review-section-title">Application Details</h2>
          <div className="review-details">
            <div className="kv"><span>Monthly income</span><strong>{a.monthly_income || "—"}</strong></div>
            <div className="kv"><span>Household members</span><strong>{a.household_members || "—"}</strong></div>
            <div className="kv"><span>Work schedule</span><strong>{a.work_schedule || "—"}</strong></div>
            <div className="kv"><span>Other animals</span><strong>{a.has_other_animals || "—"}</strong></div>
            {a.other_animals_details ? (
              <div className="kv review-wide"><span>Other animals details</span><strong>{a.other_animals_details}</strong></div>
            ) : null}
            <div className="kv"><span>Health</span><strong>{a.health_condition || "—"}</strong></div>
            {a.health_details ? (
              <div className="kv review-wide"><span>Health details</span><strong>{a.health_details}</strong></div>
            ) : null}
            {a.home_environment ? (
              <div className="kv review-wide"><span>Home environment</span><strong>{a.home_environment}</strong></div>
            ) : null}
            {a.experience_with_animals ? (
              <div className="kv review-wide"><span>Experience</span><strong>{a.experience_with_animals}</strong></div>
            ) : null}
            {a.reason_for_adoption ? (
              <div className="kv review-wide"><span>Reason</span><strong>{a.reason_for_adoption}</strong></div>
            ) : null}
            {a.additional_notes ? (
              <div className="kv review-wide"><span>Notes</span><strong>{a.additional_notes}</strong></div>
            ) : null}
          </div>
        </div>

        <div className="review-card review-wide">
          <h2 className="review-section-title">Decision</h2>

          <div className="review-field">
            <label>Message to applicant (will be sent as a notification if applicant has an account)</label>
            <textarea
              rows={3}
              value={messageToApplicant}
              onChange={(e) => setMessageToApplicant(e.target.value)}
              placeholder="Write instructions, next steps, questions, etc."
            />
          </div>

          <div className="review-field">
            <label>Rejection reason (required if rejecting)</label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why it was rejected / what to improve."
            />
          </div>

          <div className="review-actions">
            <button
              className="btn-accept"
              disabled={decisionLoading}
              onClick={() => submitDecision("accepted")}
              type="button"
            >
              Accept
            </button>
            <button
              className="btn-reject"
              disabled={decisionLoading}
              onClick={() => submitDecision("rejected")}
              type="button"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;

