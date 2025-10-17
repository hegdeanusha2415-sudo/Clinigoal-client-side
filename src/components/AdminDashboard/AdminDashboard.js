// src/components/AdminDashboard/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminCourseManagement from "./AdminCourseManagement";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  ResponsiveContainer, AreaChart, Area
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

  // ----------------- FETCH DATA -----------------
  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/payments/all");
      const paymentsWithDetails = res.data.map((p) => {
        const user = users.find((u) => u._id === p.userId);
        const course = courses.find((c) => c._id === p.courseId);
        return { ...p, user, course };
      });
      setPayments(paymentsWithDetails);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchQuizMarks = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/quizmarks");
      setQuizMarks(res.data);
    } catch (err) {
      console.error("Error fetching quiz marks:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("https://clinigoal-server-side.onrender.com/api/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
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

  // ----------------- LOGOUT -----------------
  const handleLogout = () => {
    if (window.confirm("Do you really want to logout?")) navigate("/");
  };

  // ----------------- APPROVE / REJECT / REVOKE -----------------
  const handlePaymentAction = async (paymentId, newStatus) => {
    try {
      await axios.post("https://clinigoal-server-side.onrender.com/api/payments/updateStatus", {
        paymentId,
        status: newStatus,
      });
      setPayments((prev) =>
        prev.map((p) => (p._id === paymentId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(`Error updating payment (${newStatus}):`, err);
    }
  };

  // ----------------- METRICS -----------------
  const pendingPaymentsCount = payments.filter((p) => p.status === "Pending").length;

  // ----------------- ANALYTICS DATA -----------------
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

  const ratingData = reviews.map((r, i) => ({
    name: `Review ${i + 1}`,
    rating: r.rating,
  }));

  const COLORS = ["#FFB703", "#06D6A0", "#EF476F"];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <p className="online-status">● Online</p>
        <ul className="menu">
          {[
            "dashboard", "approval", "payments", "courses", "reviews",
            "analytics", "certificates", "quizmarks", "settings"
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
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="content-section">
            <h1>Welcome Admin 🌟</h1>
            <div className="card-grid">
              <div className="dash-card blue">
                <h3>📘 Total Courses</h3>
                <p>{courses.length}</p>
              </div>
              <div className="dash-card green">
                <h3>💰 Pending Payments</h3>
                <p>{pendingPaymentsCount}</p>
              </div>
              <div className="dash-card orange">
                <h3>👥 Total Students</h3>
                <p>{users.length}</p>
              </div>
              <div className="dash-card purple">
                <h3>💬 Reviews Submitted</h3>
                <p>{reviews.length}</p>
              </div>
              <div className="dash-card teal">
                <h3>📝 Quiz Marks</h3>
                <p>{quizMarks.length}</p>
              </div>
              <div className="dash-card pink">
                <h3>🏆 Certificates Issued</h3>
                <p>{certificates.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Approval */}
        {activeTab === "approval" && (
          <div className="content-section">
            <h2>Pending Payment Approvals</h2>
            {payments.length === 0 ? (
              <p>No payments available.</p>
            ) : (
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>{p.user?.name || "Student"}</td>
                      <td>{p.course?.courseName || "Course"}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.status}</td>
                      <td>
                        {p.status === "Pending" && (
                          <>
                            <button className="approve-btn" onClick={() => handlePaymentAction(p._id, "Approved")}>
                              Approve
                            </button>
                            <button className="reject-btn" onClick={() => handlePaymentAction(p._id, "Rejected")}>
                              Reject
                            </button>
                          </>
                        )}
                        {p.status === "Approved" && (
                          <button className="revoke-btn" onClick={() => handlePaymentAction(p._id, "Pending")}>
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <div className="content-section">
            <h2>All Payments</h2>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.user?.name || "Student"}</td>
                    <td>{p.course?.courseName || "Course"}</td>
                    <td>₹{p.amount}</td>
                    <td style={{ color: p.status === "Approved" ? "green" : p.status === "Rejected" ? "red" : "orange" }}>
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="content-section">
            <h2>Courses</h2>
            <AdminCourseManagement courses={courses} setCourses={setCourses} />
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="content-section">
            <h2>Student Reviews</h2>
            {reviews.length === 0 ? <p>No reviews submitted yet.</p> : (
              reviews.map((r, i) => (
                <div className="review-item" key={i}>
                  <h4>{r.name}</h4>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} style={{ color: s <= r.rating ? "#f59e0b" : "#ccc" }}>★</span>
                    ))}
                  </div>
                  <p>{r.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ✅ Improved Analytics */}
        {activeTab === "analytics" && (
          <div className="content-section">
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

              <div className="analytics-card large">
                <h3>Student Ratings Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ratingData}>
                    <defs>
                      <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6f42c1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6f42c1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="rating" stroke="#6f42c1" fillOpacity={1} fill="url(#colorRating)" />
                    <Line type="monotone" dataKey="rating" stroke="#007bff" strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
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
