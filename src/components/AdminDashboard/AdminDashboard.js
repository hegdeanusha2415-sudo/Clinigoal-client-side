import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminCourseManagement from "../Admin/AdminCourseManagement";
import AdminVideoManagement from "../Admin/AdminVideoManagement";
import AdminNoteManagement from "../Admin/AdminNoteManagement";
import AdminQuizManagement from "../Admin/AdminQuizManagement";
import API_BASE_URL from "../../apiConfig";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, CartesianGrid, ResponsiveContainer
} from "recharts";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quizMarks, setQuizMarks] = useState([]);
  const [certificates, setCertificates] = useState([]);

  /* ------------------------ FETCH DATA ------------------------ */
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/payments`);
      const paymentsWithDetails = res.data.map((p) => {
        const user = users.find((u) => u._id === p.userId);
        const course = courses.find((c) => c._id === p.courseId);
        const dateObj = new Date(p.createdAt);
        const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        const date = dateObj.toLocaleDateString("en-US");
        const time = dateObj.toLocaleTimeString("en-US");
        return { ...p, user, course, day, date, time };
      });
      setPayments(paymentsWithDetails);
    } catch (err) {
      console.error("❌ Error fetching payments:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };

  const fetchQuizMarks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/quizmarks`);
      setQuizMarks(res.data);
    } catch (err) {
      console.error("❌ Error fetching quiz marks:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/certificates`);
      setCertificates(res.data);
    } catch (err) {
      console.error("❌ Error fetching certificates:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchCourses();
      await fetchUsers();
    };
    fetchAll().then(() => {
      fetchPayments();
      fetchQuizMarks();
      fetchCertificates();
    });
    fetchReviews();
    const interval = setInterval(fetchReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------------ LOGOUT ------------------------ */
  const handleLogout = () => {
    if (window.confirm("Do you really want to logout?")) navigate("/");
  };

  /* ------------------------ PAYMENT ACTIONS ------------------------ */
  const handlePaymentAction = async (paymentId, newStatus) => {
    try {
      await axios.post(`${API_BASE_URL}/payments/updateStatus`, {
        paymentId,
        status: newStatus,
      });
      setPayments((prev) =>
        prev.map((p) => (p._id === paymentId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(`❌ Error updating payment (${newStatus}):`, err);
    }
  };

  /* ------------------------ METRICS ------------------------ */
  const pendingPaymentsCount = payments.filter((p) => p.status === "Pending").length;

  const summaryData = [
    { name: "Students", value: users.length },
    { name: "Courses", value: courses.length },
    { name: "Payments", value: payments.length },
  ];

  const paymentData = [
    { name: "Pending", value: pendingPaymentsCount },
    { name: "Approved", value: payments.filter((p) => p.status === "Approved").length },
    { name: "Rejected", value: payments.filter((p) => p.status === "Rejected").length },
  ];

  const COLORS = ["#FFB703", "#06D6A0", "#EF476F"];

  /* ------------------------ UI ------------------------ */
  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar glass-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <p className="online-status">🟢 Online</p>
        <ul className="menu">
          {[
            "dashboard", "approval", "payments", "courses",
            "videos", "notes", "quizzes",
            "reviews", "analytics", "certificates", "quizmarks", "settings"
          ].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "approval" && pendingPaymentsCount > 0 && (
                <span className="badge">{pendingPaymentsCount}</span>
              )}
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="content-section">
            <h1 className="welcome-title">Welcome Admin 🌟</h1>
            <div className="card-grid">
              {[
                { title: "📘 Total Courses", value: courses.length, color: "linear-gradient(135deg,#2193b0,#6dd5ed)" },
                { title: "💰 Pending Payments", value: pendingPaymentsCount, color: "linear-gradient(135deg,#F7971E,#FFD200)" },
                { title: "👥 Total Students", value: users.length, color: "linear-gradient(135deg,#56ab2f,#a8e063)" },
                { title: "💬 Reviews", value: reviews.length, color: "linear-gradient(135deg,#7F00FF,#E100FF)" },
                { title: "📝 Quiz Marks", value: quizMarks.length, color: "linear-gradient(135deg,#00C9FF,#92FE9D)" },
                { title: "🏆 Certificates", value: certificates.length, color: "linear-gradient(135deg,#f953c6,#b91d73)" },
              ].map((card, i) => (
                <div key={i} className="dash-card modern" style={{ background: card.color }}>
                  <h3>{card.title}</h3>
                  <p>{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPROVAL */}
        {activeTab === "approval" && (
          <div className="content-section">
            <h2>Pending Payment Approvals</h2>
            {payments.length === 0 ? (
              <p>No payments available.</p>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>{p._id}</td>
                      <td>{p.user?.name || "Student"}</td>
                      <td>{p.course?.courseName || "Course"}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.status}</td>
                      <td>{p.date}</td>
                      <td>
                        <button onClick={() => handlePaymentAction(p._id, "Approved")}>✅ Accept</button>
                        <button onClick={() => handlePaymentAction(p._id, "Rejected")}>❌ Reject</button>
                        <button onClick={() => handlePaymentAction(p._id, "Pending")}>⏳ Pending</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <div className="content-section">
            <h2>All Payments</h2>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p._id}</td>
                    <td>{p.user?.name || "Student"}</td>
                    <td>{p.course?.courseName || "Course"}</td>
                    <td>₹{p.amount}</td>
                    <td
                      style={{
                        color:
                          p.status === "Approved"
                            ? "green"
                            : p.status === "Rejected"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {p.status}
                    </td>
                    <td>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COURSES */}
        {activeTab === "courses" && (
          <div className="content-section">
            <h2>Manage Courses</h2>
            <AdminCourseManagement courses={courses} setCourses={setCourses} />
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === "videos" && (
          <div className="content-section">
            <h2>Manage Videos 🎬</h2>
            <AdminVideoManagement />
          </div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div className="content-section">
            <h2>Manage Notes 📄</h2>
            <AdminNoteManagement />
          </div>
        )}

        {/* QUIZZES */}
        {activeTab === "quizzes" && (
          <div className="content-section">
            <h2>Manage Quizzes 🧩</h2>
            <AdminQuizManagement />
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="content-section">
            <h2>Student Reviews</h2>
            {reviews.length === 0 ? (
              <p>No reviews submitted yet.</p>
            ) : (
              reviews.map((r, i) => (
                <div className="review-item" key={i}>
                  <h4>{r.name}</h4>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ color: s <= r.rating ? "#f59e0b" : "#ccc" }}>★</span>
                    ))}
                  </div>
                  <p>{r.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="content-section analytics-section">
            <h2>Analytics Dashboard 📊</h2>
            <div className="analytics-grid">
              <div className="analytics-card large">
                <h3>Platform Summary</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2a9d8f" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="analytics-card medium">
                <h3>Payment Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {paymentData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="content-section settings-section">
            <h2>Admin Settings ⚙️</h2>
            <form className="settings-form">
              <div className="form-group">
                <label>Admin Name</label>
                <input type="text" placeholder="Enter admin name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <button type="submit" className="update-btn">Update Settings</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
