import { useEffect, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submited, setSubmited] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmited(true);
    let error = false;
    if (!/^[^\s@]+@[^\s@]+.(com|co.il)$/.test(formData.email)) {
      setEmailError(true);
      error = true;
    }
    if (error) {
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          formData,
        },
        { withCredentials: true }
      );
      // Store user data in localStorage for Header component
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success(res.data.message || "Login successful");
      navigate("/");
      // Reload page to update header
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };
  useEffect(() => {
    if (submited) {
      if (!/^[^\s@]+@[^\s@]+.(com|co.il)$/.test(formData.email)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  }, [submited, formData.email]);
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Email:
          <input
            required
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        {emailError && <div className="errorMessage">Invalid email adress</div>}
        <label>
          Password:
          <div className="password-field">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            <span
              className="toggle-eye"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>
        <div className="checkbox-container">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />
          Remember me
        </div>
        <button type="submit">Login</button>

        <p>
          Forgot your password? <Link to="/forgot-password">Reset it here</Link>
        </p>
        <p>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          <Link to="/">Continue as guest</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
