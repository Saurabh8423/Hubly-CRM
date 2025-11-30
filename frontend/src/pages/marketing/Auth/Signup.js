import React, { useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await API.post("/auth/signup", form);

      if (res.data?.success) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err.response || err.message);
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="signup-container">
      <img
        src={require("../../../Assets/logo (1).png")}
        alt="Hubly Logo"
        className="signup-logo"
      />
      <div className="signup-left">

        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create an account</h2>

          {error && <p className="error">{error}</p>}

          <div className="name-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              onChange={handleChange}
              required
            />
          </div>

         <div className="name-group">
          <label>Last Name</label>
           <input
            type="text"
            name="lastName"
            placeholder="Last name"
            onChange={handleChange}
            required
          />
         </div>

         <div className="name-group">
          <label>Email</label>
           <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
         </div>

         <div className="name-group">
          <label>Password</label>
           <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
         </div>

          <div className="name-group">
            <label> Confirm Password</label>
            <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          </div>

          <div className="terms">
            <input type="checkbox" required /> I agree to the Terms of Use and
            Privacy Policy
          </div>

          <button type="submit" className="signup-btn">Create an account</button>

          <p className="signin-link" onClick={() => navigate("/login")}>
            Already have an account? Sign in instead
          </p>
        </form>
      </div>

      <div className="signup-right">
        <img
          src={require("../../../Assets/Frame.png")}
          alt="Signup Visual"
          className="signup-image"
        />
      </div>
    </div>
  );
}

export default Signup;
