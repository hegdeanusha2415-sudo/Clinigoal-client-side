// ✅ AdminLogin.js — Fully Fixed & Working Version
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

function AdminLogin() {
  // ---------------- State ----------------
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [forgotStep, setForgotStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [createData, setCreateData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Centralized Backend URL
  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://clinigoal-server-side.onrender.com";

  // ---------------- Handlers ----------------
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Login ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!loginData.email || !loginData.password) {
        alert("Please enter valid credentials!");
        return;
      }

      console.log("🔗 Logging in via:", `${API_BASE_URL}/api/admin/login`);
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, loginData);

      if (res.data.success) {
        alert("✅ Admin logged in successfully!");
        console.log("Login response:", res.data);

        // Save token for protected routes
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminEmail", res.data.admin?.email);

        // Navigate to dashboard
        navigate("/admin-dashboard");
        setLoginData({ email: "", password: "" });
      } else {
        alert(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  // ---------------- Create Admin ----------------
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (createData.password !== createData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log("🔗 Registering admin via:", `${API_BASE_URL}/api/admin/register`);
      const res = await axios.post(`${API_BASE_URL}/api/admin/register`, {
        email: createData.email,
        password: createData.password,
      });

      alert(`✅ Admin account created for: ${createData.email}`);
      console.log("Admin registered:", res.data);

      setCreateData({ email: "", password: "", confirmPassword: "" });
      setIsCreating(false);
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || "Error creating admin account.");
    }
  };

  // ---------------- Forgot Password Flow ----------------
  const handleForgotSubmit = async () => {
    try {
      if (forgotStep === 2) {
        console.log("🔗 Sending OTP via:", `${API_BASE_URL}/api/admin/forgot-password/send-otp`);
        const res = await axios.post(`${API_BASE_URL}/api/admin/forgot-password/send-otp`, {
          email: forgotData.email,
        });
        setMessage(res.data.message);
        setForgotStep(3);
      } else if (forgotStep === 3) {
        console.log("🔗 Verifying OTP via:", `${API_BASE_URL}/api/admin/forgot-password/verify-otp`);
        const res = await axios.post(`${API_BASE_URL}/api/admin/forgot-password/verify-otp`, {
          email: forgotData.email,
          otp: forgotData.otp,
        });
        setMessage(res.data.message);
        setForgotStep(4);
      } else if (forgotStep === 4) {
        console.log("🔗 Resetting password via:", `${API_BASE_URL}/api/admin/forgot-password/reset`);
        const res = await axios.post(`${API_BASE_URL}/api/admin/forgot-password/reset`, {
          email: forgotData.email,
          newPassword: forgotData.newPassword,
        });
        setMessage(res.data.message);
        setForgotStep(1);
        setForgotData({ email: "", otp: "", newPassword: "" });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage(err.response?.data?.message || "Error occurred.");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="admin-login-wrapper">
      <div className="left-panel">
        <img
          src="https://images.pexels.com/photos/7722914/pexels-photo-7722914.jpeg"
          alt="Clinic illustration"
          className="login-image"
        />
      </div>

      <div
        className={`admin-login-right ${
          isCreating ? "show-create" : forgotStep > 1 ? "show-forgot" : ""
        }`}
      >
        {/* ---------------- Login Form ---------------- */}
        {!isCreating && forgotStep === 1 && (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <h2>Admin Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Login</button>
            <p className="switch-text">
              Forgot password?{" "}
              <span onClick={() => setForgotStep(2)}>Click here</span>
            </p>
            <p className="switch-text">
              Don’t have an account?{" "}
              <span onClick={() => setIsCreating(true)}>Create Account</span>
            </p>
          </form>
        )}

        {/* ---------------- Create Account Form ---------------- */}
        {isCreating && (
          <form className="create-form" onSubmit={handleCreateSubmit}>
            <h2>Create Admin Account</h2>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={createData.email}
              onChange={handleCreateChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={createData.password}
              onChange={handleCreateChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={createData.confirmPassword}
              onChange={handleCreateChange}
              required
            />
            <button type="submit">Create Account</button>
            <p className="switch-text">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsCreating(false);
                  setForgotStep(1);
                }}
              >
                Login
              </span>
            </p>
          </form>
        )}

        {/* ---------------- Forgot Password Form ---------------- */}
        {!isCreating && forgotStep > 1 && (
          <div className="forgot-form">
            {forgotStep === 2 && (
              <>
                <h2>Forgot Password</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  required
                />
                <button onClick={handleForgotSubmit}>Send OTP</button>
              </>
            )}
            {forgotStep === 3 && (
              <>
                <h2>Verify OTP</h2>
                <input
                  type="number"
                  name="otp"
                  placeholder="Enter OTP"
                  value={forgotData.otp}
                  onChange={handleForgotChange}
                  required
                />
                <button onClick={handleForgotSubmit}>Verify OTP</button>
              </>
            )}
            {forgotStep === 4 && (
              <>
                <h2>Set New Password</h2>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  required
                />
                <button onClick={handleForgotSubmit}>Reset Password</button>
              </>
            )}
            <p className="switch-text">
              Remember password?{" "}
              <span
                onClick={() => {
                  setForgotStep(1);
                  setMessage("");
                }}
              >
                Login
              </span>
            </p>
            {message && <p className="info-message">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
