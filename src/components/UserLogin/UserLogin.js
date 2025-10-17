import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserLogin.css";

function UserLogin() {
  const [currentForm, setCurrentForm] = useState("login"); // "login" | "register" | "forgot"
  const [forgotStep, setForgotStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [message, setMessage] = useState("");

  // Form data
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const API_BASE_URL = "https://clinigoal-server-side.onrender.com";

  // ✅ Handle input change
  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") setLoginData({ ...loginData, [name]: value });
    else if (type === "register") setRegisterData({ ...registerData, [name]: value });
    else if (type === "forgot") setForgotData({ ...forgotData, [name]: value });
  };

  // ✅ Handle login or register submit
  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setMessage("");

    try {
      if (type === "Login") {
        const res = await axios.post(`${API_BASE_URL}/api/user/login`, loginData);
        if (res.data.success || res.status === 200) {
          alert("✅ Login successful!");
          navigate("/user-dashboard");
        }
      } else if (type === "Register") {
        const res = await axios.post(`${API_BASE_URL}/api/user/register`, registerData);
        if (res.data.success || res.status === 200) {
          alert("✅ Registration successful! Redirecting to login...");
          setTimeout(() => setCurrentForm("login"), 800);
        }
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error during authentication.");
    }
  };

  // ✅ Forgot password flow (3-step: send OTP → verify OTP → reset password)
  const handleForgot = async () => {
    try {
      if (forgotStep === 1) {
        const res = await axios.post(`${API_BASE_URL}/api/forgot-password/send-otp`, {
          email: forgotData.email,
        });
        setMessage(res.data.message);
        setForgotStep(2);
      } else if (forgotStep === 2) {
        const res = await axios.post(`${API_BASE_URL}/api/forgot-password/verify-otp`, {
          email: forgotData.email,
          otp: forgotData.otp,
        });
        setMessage(res.data.message);
        setForgotStep(3);
      } else if (forgotStep === 3) {
        const res = await axios.post(`${API_BASE_URL}/api/forgot-password/reset`, {
          email: forgotData.email,
          newPassword: forgotData.newPassword,
        });
        setMessage(res.data.message);
        alert("✅ Password reset successful! Please login again.");
        setForgotStep(1);
        setForgotData({ email: "", otp: "", newPassword: "" });
        setCurrentForm("login");
      }
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error processing request.");
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <img
          src="https://images.pexels.com/photos/7722914/pexels-photo-7722914.jpeg"
          alt="Clinic illustration"
          className="login-image"
        />
        <div className="overlay-text">
          <h1>Welcome to CliniGoal</h1>
          <p>Your path to smarter medical learning starts here.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className={`form-container fade-transition ${currentForm}`}>
          {/* ---------------- LOGIN FORM ---------------- */}
          {currentForm === "login" && (
            <form className="form fade-in" onSubmit={(e) => handleSubmit(e, "Login")}>
              <h2>Login</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                required
              />
              <button type="submit">Login</button>
              <p>
                Don’t have an account?{" "}
                <span onClick={() => setCurrentForm("register")}>Create one</span>
              </p>
              <p>
                Forgot password?{" "}
                <span onClick={() => setCurrentForm("forgot")}>Reset</span>
              </p>
              {message && <p className="message">{message}</p>}
            </form>
          )}

          {/* ---------------- REGISTER FORM ---------------- */}
          {currentForm === "register" && (
            <form className="form fade-in" onSubmit={(e) => handleSubmit(e, "Register")}>
              <h2>Create Account</h2>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => handleChange(e, "register")}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => handleChange(e, "register")}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => handleChange(e, "register")}
                required
              />
              <button type="submit">Sign Up</button>
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrentForm("login")}>Login</span>
              </p>
              {message && <p className="message">{message}</p>}
            </form>
          )}

          {/* ---------------- FORGOT PASSWORD FORM ---------------- */}
          {currentForm === "forgot" && (
            <div className="form fade-in">
              {forgotStep === 1 && (
                <>
                  <h2>Forgot Password</h2>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={forgotData.email}
                    onChange={(e) => handleChange(e, "forgot")}
                    required
                  />
                  <button onClick={handleForgot}>Send OTP</button>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <h2>Verify OTP</h2>
                  <input
                    type="number"
                    name="otp"
                    placeholder="Enter OTP"
                    value={forgotData.otp}
                    onChange={(e) => handleChange(e, "forgot")}
                    required
                  />
                  <button onClick={handleForgot}>Verify OTP</button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <h2>Set New Password</h2>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={forgotData.newPassword}
                    onChange={(e) => handleChange(e, "forgot")}
                    required
                  />
                  <button onClick={handleForgot}>Reset Password</button>
                </>
              )}

              <p>
                Remember your password?{" "}
                <span onClick={() => setCurrentForm("login")}>Login</span>
              </p>
              {message && <p className="message">{message}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
