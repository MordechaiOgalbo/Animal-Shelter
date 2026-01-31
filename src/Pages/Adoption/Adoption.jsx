import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Adoption.css";

const Adoption = () => {
  const { id } = useParams(); // animal id
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loadingAnimal, setLoadingAnimal] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_contact: "phone", // phone | email | whatsapp
    monthly_income: "",
    home_environment: "", // apartment/house/yard/etc
    household_members: "",
    work_schedule: "",
    has_other_animals: "no", // yes | no
    other_animals_details: "",
    health_condition: "none", // none | disabled | bedridden | other
    health_details: "",
    experience_with_animals: "",
    reason_for_adoption: "",
    additional_notes: "",
  });

  const canShowOtherAnimalsDetails = form.has_other_animals === "yes";
  const canShowHealthDetails = form.health_condition !== "none";

  const monthlyIncomeNumber = useMemo(() => {
    const v = Number(String(form.monthly_income || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(v) ? v : 0;
  }, [form.monthly_income]);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;
      try {
        setLoadingAnimal(true);
        const res = await axios.get(`http://localhost:5000/api/animal/${id}`);
        setAnimal(res.data);
      } catch (e) {
        setAnimal(null);
      } finally {
        setLoadingAnimal(false);
      }
    };
    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Very light validation (you can make this stricter later)
    if (!form.full_name.trim()) return toast.error("Please enter your full name.");
    if (!form.email.trim()) return toast.error("Please enter your email.");
    if (!form.phone.trim()) return toast.error("Please enter your phone number.");
    if (!form.home_environment.trim()) return toast.error("Please describe your home environment.");

    try {
      await axios.post(`http://localhost:5000/api/adoption/${id}/apply`, form, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Application submitted! The reviewer has been notified.");
      setTimeout(() => {
        if (id) navigate(`/animal/${id}`);
        else navigate("/animalCatalog");
      }, 900);
    } catch (error) {
      console.error("Adoption submit error:", error);
      toast.error(error.response?.data?.error || "Failed to submit application");
    }
  };

  return (
    <div className="adoption-page">
      <div className="adoption-header">
        <Link to={id ? `/animal/${id}` : "/animalCatalog"} className="adoption-back-link">
          ← Back
        </Link>
        <h1 className="adoption-title">Adoption Application</h1>
        <p className="adoption-subtitle">
          Tell us about yourself so we can make sure it’s a great match.
        </p>
      </div>

      <div className="adoption-content">
        <div className="adoption-card adoption-animal-card">
          <h2 className="adoption-card-title">Animal</h2>
          {loadingAnimal ? (
            <div className="adoption-muted">Loading animal…</div>
          ) : animal ? (
            <div className="adoption-animal">
              <img
                className="adoption-animal-img"
                src={animal.img || "/placeholder.png"}
                alt={animal.name || "Animal"}
              />
              <div className="adoption-animal-meta">
                <div className="adoption-animal-name">{animal.name || "Unnamed"}</div>
                <div className="adoption-animal-tags">
                  {animal.category && <span className="adoption-tag">{animal.category}</span>}
                  {animal.type && <span className="adoption-tag">{animal.type}</span>}
                  {animal.animal && <span className="adoption-tag">{animal.animal}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="adoption-muted">
              Animal details unavailable (you can still fill the form).
            </div>
          )}
        </div>

        <form className="adoption-card adoption-form" onSubmit={handleSubmit}>
          <h2 className="adoption-card-title">Your Information</h2>

          <div className="adoption-grid">
            <div className="adoption-field">
              <label>Full name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} />
            </div>

            <div className="adoption-field">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="adoption-field">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="adoption-field">
              <label>Preferred contact</label>
              <select
                name="preferred_contact"
                value={form.preferred_contact}
                onChange={handleChange}
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div className="adoption-field">
              <label>Monthly income</label>
              <input
                name="monthly_income"
                placeholder="Example: 6000"
                value={form.monthly_income}
                onChange={handleChange}
              />
              <div className="adoption-hint">
                Current: {monthlyIncomeNumber ? monthlyIncomeNumber.toLocaleString() : "—"}
              </div>
            </div>

            <div className="adoption-field adoption-field-wide">
              <label>Home environment</label>
              <textarea
                name="home_environment"
                rows={4}
                placeholder="Apartment/house, yard/balcony, who lives with you, daily routine…"
                value={form.home_environment}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-field">
              <label>Household members</label>
              <input
                name="household_members"
                placeholder="Example: 2 adults, 1 child"
                value={form.household_members}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-field">
              <label>Work schedule</label>
              <input
                name="work_schedule"
                placeholder="Example: 9–5, remote, shift work…"
                value={form.work_schedule}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-field">
              <label>Do you have other animals?</label>
              <select name="has_other_animals" value={form.has_other_animals} onChange={handleChange}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {canShowOtherAnimalsDetails && (
              <div className="adoption-field adoption-field-wide">
                <label>Other animals details</label>
                <textarea
                  name="other_animals_details"
                  rows={3}
                  placeholder="Type, age, temperament, vaccinated/spayed/neutered, etc."
                  value={form.other_animals_details}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="adoption-field">
              <label>Health condition</label>
              <select
                name="health_condition"
                value={form.health_condition}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="disabled">Disabled</option>
                <option value="bedridden">Bedridden</option>
                <option value="other">Other</option>
              </select>
            </div>

            {canShowHealthDetails && (
              <div className="adoption-field adoption-field-wide">
                <label>Health details</label>
                <textarea
                  name="health_details"
                  rows={3}
                  placeholder="Tell us anything important so we can support you and ensure a safe match."
                  value={form.health_details}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="adoption-field adoption-field-wide">
              <label>Experience with animals</label>
              <textarea
                name="experience_with_animals"
                rows={3}
                placeholder="Past pets, fostering, training, vet care, etc."
                value={form.experience_with_animals}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-field adoption-field-wide">
              <label>Why do you want to adopt?</label>
              <textarea
                name="reason_for_adoption"
                rows={3}
                value={form.reason_for_adoption}
                onChange={handleChange}
              />
            </div>

            <div className="adoption-field adoption-field-wide">
              <label>Additional notes</label>
              <textarea
                name="additional_notes"
                rows={3}
                value={form.additional_notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="adoption-actions">
            <button type="submit" className="adoption-submit">
              Submit Application
            </button>
            <Link className="adoption-cancel" to={id ? `/animal/${id}` : "/animalCatalog"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adoption;

