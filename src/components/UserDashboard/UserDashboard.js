// src/components/UserDashboard/UserDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoursePlayer from "../CoursePlayer";
import "./UserDashboard.css";

function UserDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const USER_ID = user?.id || "USER_ID";
  const USER_NAME = user?.name || "Test User";
  const USER_EMAIL = user?.email || "test@example.com";

  // ----------------- FETCH COURSES -----------------
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  // ----------------- FETCH ENROLLED COURSES -----------------
  const fetchEnrolledCourses = async () => {
    try {
      // ✅ Corrected endpoint: use query param
      const res = await axios.get(`http://localhost:5000/api/payments?userId=${USER_ID}`);
      // Only approved payments
      setEnrolledCourses(res.data.filter(p => p.status === "Approved").map((p) => p.courseId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, [USER_ID]);

  // ----------------- FETCH REVIEWS -----------------
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ----------------- RAZORPAY -----------------
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDummyEnroll = async (courseId) => {
    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load. Check your internet.");

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: 100 * 100,
      currency: "INR",
      name: "Clinigoal (Test)",
      description: "Dummy Course Enrollment",
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id || "TEST123";

        try {
          // Save payment as Pending in backend
          await axios.post("http://localhost:5000/api/payments", {
            userId: USER_ID,
            courseId,
            amount: 100,
            paymentId,
          });

          alert("Payment recorded! Waiting for admin approval.");
          fetchEnrolledCourses(); // Refresh enrolled courses
        } catch (err) {
          console.error(err);
          alert("Failed to save payment.");
        }
      },
      prefill: { name: USER_NAME, email: USER_EMAIL },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ----------------- LOGOUT -----------------
  const handleLogout = () => {
    if (window.confirm("Do you really want to logout?")) navigate("/");
  };

  // ----------------- SUBMIT REVIEW -----------------
  const handleSubmitReview = async () => {
    if (!name || !text || rating === 0) return alert("Fill all fields!");
    const newReview = { name, text, rating };
    try {
      await axios.post("http://localhost:5000/api/reviews", newReview);
      setReviews([newReview, ...reviews]);
      setName("");
      setText("");
      setRating(0);
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">🎓 Clinigoal</h2>
        <ul className="menu">
          {["dashboard", "mycourses", "available", "certificates", "progress", "reviews"].map(
            (tab) => (
              <li
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            )
          )}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="content-section">
            <h1>Welcome Back, {USER_NAME}!</h1>
            <p>Overview of your learning journey</p>
            <div className="card-grid">
              <div className="dash-card">
                <h3>My Courses</h3>
                <p>{enrolledCourses.length} Enrolled</p>
              </div>
              <div className="dash-card">
                <h3>Available Courses</h3>
                <p>{courses.length} Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Available Courses */}
        {activeTab === "available" && (
          <div className="content-section">
            <h2>Available Courses</h2>
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h4>{course.courseName}</h4>
                <p>Videos: {course.videos?.length || 0}</p>
                <p>Notes: {course.notes?.length || 0}</p>
                <p>Quizzes: {course.quizzes?.length || 0}</p>
                {enrolledCourses.includes(course._id) ? (
                  <button disabled>Enrolled ✅</button>
                ) : (
                  <button onClick={() => handleDummyEnroll(course._id)}>Enroll & Pay (Test)</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* My Courses */}
        {activeTab === "mycourses" && (
          <div className="content-section">
            <h2>My Courses</h2>
            {courses
              .filter((c) => enrolledCourses.includes(c._id))
              .map((c) => (
                <div key={c._id} className="course-card">
                  <CoursePlayer course={c} user={{ id: USER_ID, name: USER_NAME, email: USER_EMAIL }} />
                </div>
              ))}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="content-section">
            <h2>Submit a Review</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Write your review..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "filled" : ""}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button onClick={handleSubmitReview}>Submit Review</button>
            {successMessage && <p>{successMessage}</p>}

            <h3>All Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
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
      </main>
    </div>
  );
}

export default UserDashboard;
