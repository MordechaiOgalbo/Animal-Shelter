import { useEffect, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submited, setSubmited] = useState(false);
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
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        formData,
      },
      { withCredentials: true }
    );
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
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <div className="show-password-container">
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            👁️
          </button>
        </div>
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
