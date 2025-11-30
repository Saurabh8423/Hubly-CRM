import React, { useState } from "react";
import API from "../../../api/api";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import Logo from "../../../Assets/logo (1).png";
import Frame from "../../../Assets/Frame.png";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      if (res.data?.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || {}));
        navigate("/dashboard");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <img src={Logo} alt="Hubly Logo" className="login-logo" />

        <div className="login-content">
          <h2>Sign in to your Plexify</h2>

          <form onSubmit={handleLogin} className="login-form">
            {error && <p className="error">{error}</p>}

            <label>Username</label>
            <input
              type="email"
              name="email"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit" className="login-btn">
              Log in
            </button>

            <p className="signup-text">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>

            <p className="last-text">
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
          </form>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="login-right">
        <img src={Frame} alt="Login Visual" className="login-image" />
      </div>
    </div>
  );
}

export default Login;
