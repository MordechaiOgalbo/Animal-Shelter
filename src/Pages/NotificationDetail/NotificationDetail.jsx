import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./NotificationDetail.css";

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/notifications/me/${id}`, {
          withCredentials: true,
        });
        setNotification(res.data.notification);
      } catch (e) {
        toast.error(e.response?.data?.error || "Failed to load notification");
        setNotification(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNotification();
  }, [id]);

  if (loading) {
    return (
      <div className="notification-detail-page">
        <div className="notification-detail-card">Loading notification…</div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notification-detail-page">
        <div className="notification-detail-card">
          <p>Notification not found.</p>
          <Link className="notification-detail-link" to="/profile">
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const n = notification;
  const data = n.data || {};

  return (
    <div className="notification-detail-page">
      <div className="notification-detail-header">
        <Link className="notification-detail-link" to="/profile">
          ← Back to Notifications
        </Link>
        <h1 className="notification-detail-title">Notification Details</h1>
      </div>

      <div className="notification-detail-card">
        <div className="notification-detail-meta">
          <div className="notification-detail-date">
            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
          </div>
          {n.read ? (
            <span className="notification-detail-badge read">Read</span>
          ) : (
            <span className="notification-detail-badge unread">Unread</span>
          )}
        </div>

        <h2 className="notification-detail-heading">{n.title}</h2>
        {n.message && <p className="notification-detail-message">{n.message}</p>}

        {/* Show additional details based on notification type */}
        {n.type === "adoption_decision" && (
          <div className="notification-detail-section">
            <h3 className="notification-detail-section-title">Decision Details</h3>
            <div className="notification-detail-kv">
              <div className="kv-row">
                <span className="kv-label">Status:</span>
                <strong className={`kv-value ${data.decision === "accepted" ? "accepted" : "rejected"}`}>
                  {data.decision === "accepted" ? "✅ Accepted" : "❌ Rejected"}
                </strong>
              </div>
              {data.animalName && (
                <div className="kv-row">
                  <span className="kv-label">Animal:</span>
                  <strong className="kv-value">{data.animalName}</strong>
                </div>
              )}
              {data.message_to_applicant && (
                <div className="kv-row">
                  <span className="kv-label">Message:</span>
                  <div className="kv-value">{data.message_to_applicant}</div>
                </div>
              )}
              {data.rejection_reason && (
                <div className="kv-row">
                  <span className="kv-label">Rejection Reason:</span>
                  <div className="kv-value">{data.rejection_reason}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {n.type === "adoption_application" && (
          <div className="notification-detail-section">
            <h3 className="notification-detail-section-title">Application Details</h3>
            <div className="notification-detail-kv">
              {data.applicantName && (
                <div className="kv-row">
                  <span className="kv-label">Applicant:</span>
                  <strong className="kv-value">{data.applicantName}</strong>
                </div>
              )}
              {data.applicantEmail && (
                <div className="kv-row">
                  <span className="kv-label">Email:</span>
                  <a href={`mailto:${data.applicantEmail}`} className="kv-value link">
                    {data.applicantEmail}
                  </a>
                </div>
              )}
              {data.applicantPhone && (
                <div className="kv-row">
                  <span className="kv-label">Phone:</span>
                  <a href={`tel:${data.applicantPhone}`} className="kv-value link">
                    {data.applicantPhone}
                  </a>
                </div>
              )}
              {data.animalName && (
                <div className="kv-row">
                  <span className="kv-label">Animal:</span>
                  <strong className="kv-value">{data.animalName}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="notification-detail-actions">
          {n.link && (
            <Link
              to={n.link}
              className="notification-detail-action-btn primary"
            >
              {n.type === "adoption_application" ? "Review Application" : "View Details"}
            </Link>
          )}
          {data.animalId && (
            <Link
              to={`/animal/${data.animalId}`}
              className="notification-detail-action-btn secondary"
            >
              View Animal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
