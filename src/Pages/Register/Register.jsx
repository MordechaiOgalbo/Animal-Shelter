import { useState } from "react";
import { toast } from "react-toastify";
import "./Register.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    avatarColor: "#3bad80",
    avatarFile: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, avatarFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("The passwords do not match");
      return;
    }

    console.log("Submitting:", formData);
  };

  return (
    <div className="register-page">
      <div className="profile-preview">
        <h2>Profile Preview</h2>
        <div className="profile-card">
          {formData.avatarFile ? (
            <img
              src={URL.createObjectURL(formData.avatarFile)}
              alt="avatar"
              className="avatar-placeholder"
            />
          ) : (
            <div
              className="avatar-placeholder"
              style={{ backgroundColor: formData.avatarColor }}
            >
              {formData.user_name ? formData.user_name[0].toUpperCase() : "?"}
            </div>
          )}

          <div className="profile-text">
            <p>
              <strong>Username:</strong> {formData.user_name || "Your username"}
            </p>
            <p>
              <strong>Email:</strong> {formData.email || "Your email"}
            </p>
          </div>

          <p>
            <strong>Phone:</strong>{" "}
            {formData.phone_number || "Your phone number"}
          </p>
        </div>
      </div>

      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              required
              type="text"
              name="user_name"
              placeholder="Username"
              value={formData.user_name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </label>

          <label>
            Password:
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Confirm Password:
            <input
              required
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <label>
            Choose Avatar Color:
            <select
              name="avatarColor"
              value={formData.avatarColor}
              onChange={handleChange}
            >
              <option value="#3bad80">Green</option>
              <option value="#3498db">Blue</option>
              <option value="#e74c3c">Red</option>
              <option value="#f1c40f">Yellow</option>
              <option value="#9b59b6">Purple</option>
            </select>
          </label>

          <label>
            Upload Avatar (optional):
            <input
              type="file"
              name="avatarFile"
              accept="image/*"
              onChange={handleChange}
            />
          </label>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
