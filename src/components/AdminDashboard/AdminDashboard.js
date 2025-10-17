// src/components/AdminDashboard/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminCourseManagement from "./AdminCourseManagement";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
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
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments/all");
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
      const res = await axios.get("http://localhost:5000/api/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchQuizMarks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizmarks");
      setQuizMarks(res.data);
    } catch (err) {
      console.error("Error fetching quiz marks:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/certificates");
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

  // ----------------- PAYMENT ACTION -----------------
  const handlePaymentAction = async (paymentId, action) => {
    try {
      await axios.post("http://localhost:5000/api/payments/approve", { paymentId, action });
      setPayments((prev) =>
        prev.map((p) =>
          p._id === paymentId ? { ...p, status: action } : p
        )
      );
    } catch (err) {
      console.error(`Error updating payment (${action}):`, err);
    }
  };

  // ----------------- METRICS -----------------
  const pendingPaymentsCount = payments.filter((p) => p.status === "Pending").length;

  // ----------------- ANALYTICS DATA -----------------
  const studentCourseData = [
    { name: "Students", value: users.length },
    { name: "Courses Completed", value: courses.filter((c) => c.completed).length },
  ];

  const paymentData = [
    { name: "Pending", value: payments.filter(p => p.status === "Pending").length },
    { name: "Approved", value: payments.filter(p => p.status === "Approved").length },
  ];

  const ratingData = reviews.map((r, index) => ({ name: `R${index + 1}`, rating: r.rating }));
  const COLORS = ["#fd7e14", "#28a745"];

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
                    <th>Email</th>
                    <th>Course</th>
                    <th>Transaction ID</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>{p.user?.name || "Student"}</td>
                      <td>{p.user?.email || "-"}</td>
                      <td>{p.course?.courseName || "Course"}</td>
                      <td>{p.transactionId || "-"}</td>
                      <td>{new Date(p.createdAt).toLocaleString()}</td>
                      <td>₹{p.amount}</td>
                      <td>
                        <span
                          className={`badge-status ${
                            p.status === "Pending"
                              ? "badge-pending"
                              : p.status === "Approved"
                              ? "badge-approved"
                              : "badge-rejected"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.status === "Pending" && (
                          <>
                            <button className="approve-btn" onClick={() => handlePaymentAction(p._id, "Approved")}>Approve</button>
                            <button className="reject-btn" onClick={() => handlePaymentAction(p._id, "Rejected")}>Reject</button>
                          </>
                        )}
                        {p.status === "Approved" && (
                          <button className="revoke-btn" onClick={() => handlePaymentAction(p._id, "Pending")}>Revoke</button>
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
                  <th>Email</th>
                  <th>Course</th>
                  <th>Transaction ID</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.user?.name || "Student"}</td>
                    <td>{p.user?.email || "-"}</td>
                    <td>{p.course?.courseName || "Course"}</td>
                    <td>{p.transactionId || "-"}</td>
                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                    <td>₹{p.amount}</td>
                    <td>
                      <span
                        className={`badge-status ${
                          p.status === "Pending"
                            ? "badge-pending"
                            : p.status === "Approved"
                            ? "badge-approved"
                            : "badge-rejected"
                        }`}
                      >
                        {p.status === "Approved" ? "Paid" : p.status}
                      </span>
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
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= r.rating ? "#f59e0b" : "#ccc" }}>★</span>
                    ))}
                  </div>
                  <p>{r.text}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="content-section">
            <h2>Analytics 📊</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Students vs Courses Completed</h3>
                <BarChart width={350} height={250} data={studentCourseData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#2a5298" />
                </BarChart>
              </div>
              <div className="analytics-card">
                <h3>Payment Status</h3>
                <PieChart width={350} height={250}>
                  <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="analytics-card">
                <h3>Student Ratings</h3>
                <LineChart width={350} height={250} data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0,5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rating" stroke="#6f42c1" activeDot={{ r: 8 }} />
                </LineChart>
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
