import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { compressImage } from "../../utils/imageCompression";

const requirements = [
  { id: "length", regex: /.{8,}/, message: "At least 8 characters" },
  { id: "uppercase", regex: /[A-Z]/, message: "At least one uppercase letter" },
  { id: "lowercase", regex: /[a-z]/, message: "At least one lowercase letter" },
  { id: "number", regex: /\d/, message: "At least one number" },
  {
    id: "special",
    regex: /[^A-Za-z0-9]/,
    message: "At least one special character (! @ # etc.)",
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    avatarColor: "#3bad80",
    avatarTextColor: "#ffffff",
    avatarFile: null,
  });

  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const checks = requirements.map((req) => ({
      ...req,
      passed: req.regex.test(formData.password),
    }));
    setResults(checks);
    setScore(checks.filter((c) => c.passed).length);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, avatarFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors;
    if (score < 3) {
      setPasswordError(true);
      hasErrors = true;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("The passwords do not match");
    }
    if (hasErrors) {
      return;
    }
    try {
      // Convert and compress avatar file to base64 data URL if present
      let profileImageUrl = "";
      if (formData.avatarFile && formData.avatarFile instanceof File) {
        try {
          // Compress image: max 800x800px for profile images, quality 0.85, max 1MB
          profileImageUrl = await compressImage(formData.avatarFile, {
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.85,
            maxSizeMB: 1
          });
        } catch (error) {
          console.error("Image compression error:", error);
          toast.warning("Image compression failed, using original image");
          // Fallback to original if compression fails
          const reader = new FileReader();
          profileImageUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(formData.avatarFile);
          });
        }
      } else if (formData.avatarFile) {
        // If it's already a URL string, use it
        profileImageUrl = formData.avatarFile;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          user_name: formData.user_name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          profile_color: formData.avatarColor,
          profile_text_color: formData.avatarTextColor,
          profile_image: profileImageUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }

    console.log("Submitting:", formData);
  };
  const strengthLabel = [
    "",
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Excellent",
  ];
  const strengthColor = [
    "#ccc",
    "#ff3b30",
    "#ff6f00",
    "#ff9500",
    "#ffb74d",
    "#00ad17ff",
  ];
  const strengthIndex = Math.min(score, 5);
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
              style={{ 
                backgroundColor: formData.avatarColor,
                color: formData.avatarTextColor
              }}
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setShowRequirements(true);
              }}
              onFocus={() => setShowRequirements(true)}
              onBlur={() => setShowRequirements(false)}
            />
          </label>

          <div style={{ marginTop: 20 }}>
            Password strength: <strong>{strengthLabel[strengthIndex]}</strong>
          </div>

          <div
            className="password-bar-bg"
            style={{
              marginTop: 10,
              marginBottom: 20,
              height: 15,
              backgroundColor: "#ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              className="password-bar-fill"
              style={{
                width: (score / 5) * 100 + "%",
                height: "100%",
                backgroundColor: strengthColor[strengthIndex],
                borderRadius: 10,
                transition: "width 0.3s ease, background-color 0.3s ease",
              }}
            />
          </div>

          {showRequirements &&
            results.filter((req) => !req.passed).length > 0 && (
              <div className="password-checker" style={{ marginTop: 10, marginBottom: 20 }}>
                <ul className="password-list">
                  {results
                    .filter((req) => !req.passed)
                    .map((req) => (
                      <li
                        className="password-item"
                        key={req.id}
                        style={{ color: "red" }}
                      >
                        ❌ {req.message}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          <label>
            Confirm Password:
            <input
              required
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <div className="color-picker-wrapper">
            <label htmlFor="avatarColor">Choose Avatar Background Color:</label>
            <div className="color-picker-container">
              <input
                type="color"
                id="avatarColor"
                name="avatarColor"
                value={formData.avatarColor}
                onChange={handleChange}
                className="color-picker-input"
              />
              <span className="color-picker-value">{formData.avatarColor}</span>
            </div>
          </div>

          <div className="color-picker-wrapper">
            <label htmlFor="avatarTextColor">Choose Letter Color:</label>
            <div className="color-picker-container">
              <input
                type="color"
                id="avatarTextColor"
                name="avatarTextColor"
                value={formData.avatarTextColor}
                onChange={handleChange}
                className="color-picker-input"
              />
              <span className="color-picker-value">{formData.avatarTextColor}</span>
            </div>
          </div>

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

          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <p className="guest-link">
          <Link to="/">Continue as guest</Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
