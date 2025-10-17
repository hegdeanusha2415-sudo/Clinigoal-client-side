import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserLogin.css";

function Login() {
  const [currentForm, setCurrentForm] = useState("login"); // login, register, forgot
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [forgotData, setForgotData] = useState({ email: "", otp: "", newPassword: "" });
  const [forgotStep, setForgotStep] = useState(1); // 1: send OTP, 2: verify OTP, 3: set new password
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") setLoginData({ ...loginData, [name]: value });
    else if (type === "register") setRegisterData({ ...registerData, [name]: value });
    else if (type === "forgot") setForgotData({ ...forgotData, [name]: value });
  };

  // ----------------- FORM SUBMIT -----------------
  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (type === "Login") {
      if (loginData.email && loginData.password) {
        alert("Login successful!");
        navigate("/user-dashboard");
        setLoginData({ email: "", password: "" });
      } else alert("Please enter valid login details!");
    } else if (type === "Register") {
      if (registerData.name && registerData.email && registerData.password) {
        alert("Registration successful! Redirecting to login...");
        setTimeout(() => setCurrentForm("login"), 1000);
        setRegisterData({ name: "", email: "", password: "" });
      } else alert("Please fill in all fields!");
    }
  };

  // ----------------- FORGOT PASSWORD FLOW -----------------
  const handleForgot = async (stepAction) => {
    try {
      if (forgotStep === 1) {
        // Send OTP
        const res = await axios.post("http://localhost:5000/api/forgot-password/send-otp", {
          email: forgotData.email,
        });
        setMessage(res.data.message);
        setForgotStep(2);
      } else if (forgotStep === 2) {
        // Verify OTP
        const res = await axios.post("http://localhost:5000/api/forgot-password/verify-otp", {
          email: forgotData.email,
          otp: forgotData.otp,
        });
        setMessage(res.data.message);
        setForgotStep(3);
      } else if (forgotStep === 3) {
        // Reset Password
        const res = await axios.post("http://localhost:5000/api/forgot-password/reset", {
          email: forgotData.email,
          newPassword: forgotData.newPassword,
        });
        setMessage(res.data.message);
        setForgotStep(1);
        setForgotData({ email: "", otp: "", newPassword: "" });
        setCurrentForm("login");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className={`login-page ${currentForm}-active`}>
      <div className="login-container">
        {/* Left Image Panel */}
        <div className="image-panel">
          {currentForm === "login" && <h2>Welcome Back!</h2>}
          {currentForm === "register" && <h2>Create Your Account</h2>}
          {currentForm === "forgot" && <h2>Reset Password</h2>}
        </div>

        {/* Form Panel */}
        <div className="form-panel">
          {/* Login Form */}
          {currentForm === "login" && (
            <form className="form login-form" onSubmit={(e) => handleSubmit(e, "Login")}>
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
              <p className="switch-text">
                Don't have an account? <span onClick={() => setCurrentForm("register")}>Create Account</span>
              </p>
              <p className="switch-text">
                Forgot password? <span onClick={() => setCurrentForm("forgot")}>Click here</span>
              </p>
            </form>
          )}

          {/* Register Form */}
          {currentForm === "register" && (
            <form className="form register-form" onSubmit={(e) => handleSubmit(e, "Register")}>
              <h2>Create Account</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
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
              <button type="submit">Register</button>
              <p className="switch-text">
                Already have an account? <span onClick={() => setCurrentForm("login")}>Login</span>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {currentForm === "forgot" && (
            <div className="form forgot-form">
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
                  <button onClick={() => handleForgot()}>Send OTP</button>
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
                  <button onClick={() => handleForgot()}>Verify OTP</button>
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
                  <button onClick={() => handleForgot()}>Reset Password</button>
                </>
              )}
              <p className="switch-text">
                Remember your password? <span onClick={() => setCurrentForm("login")}>Login</span>
              </p>
              {message && <p>{message}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
