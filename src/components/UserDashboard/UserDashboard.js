import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoursePlayer from "../CoursePlayer";
import "./UserDashboard.css";
import API_BASE_URL from "../../apiConfig";


function UserDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [enrolledPayments, setEnrolledPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [completedCourses, setCompletedCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [loginTime, setLoginTime] = useState(""); // ✅ added

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const USER_ID = user?._id || user?.id || "USER_ID";
  const USER_NAME = profile.name || "Test User";
  const USER_EMAIL = profile.email || "test@example.com";

  // ----------------- SET LOGIN TIME -----------------
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString();
    setLoginTime(formatted);
    localStorage.setItem("lastLogin", formatted);
  }, []);

  // ----------------- FETCH COURSES -----------------
  useEffect(() => {
    const fetchCourses = async () => {
      try {
const res = await axios.get(`${API_BASE_URL}/api/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  // ----------------- FETCH ENROLLED PAYMENTS -----------------
  const fetchEnrolledPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/payments?userId=${USER_ID}`);

      setEnrolledPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnrolledPayments();
  }, [USER_ID]);

  // ----------------- FETCH REVIEWS -----------------
  const fetchReviews = async () => {
    try {
const res = await axios.get(`${API_BASE_URL}/api/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ----------------- SAVE PROFILE -----------------
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
  `${API_BASE_URL}/api/users/${USER_ID}/profile`,
        profile
      );
      setProfile(res.data);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  // ----------------- RAZORPAY DUMMY ENROLL -----------------
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
    if (!res) return alert("Razorpay SDK failed to load.");

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: 100 * 100,
      currency: "INR",
      name: "Clinigoal (Test)",
      description: "Dummy Course Enrollment",
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id || "TEST123";
        try {
          await axios.post(`${API_BASE_URL}/api/payments`, {
            userId: USER_ID,
            courseId,
            amount: 100,
            paymentId,
            status: "Pending",
          });
          alert("Payment recorded! Waiting for admin approval.");
          fetchEnrolledPayments();
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

  // ----------------- QUIZ SUBMISSION -----------------
  const handleQuizSubmit = async (courseId, paymentId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/quizzes/submit`, {
        userId: USER_ID,
        courseId,
      });
      await axios.put(`${API_BASE_URL}/api/payments/${paymentId}/progress`,
        { "progress.completed": true }
      );
      alert("🎉 Quiz submitted! Certificate unlocked!");
      setCompletedCourses((prev) => [...prev, courseId]);
      fetchEnrolledPayments();
    } catch (err) {
      console.error(err);
      alert("Quiz submission failed.");
    }
  };

  // ----------------- SUBMIT REVIEW -----------------
  const handleSubmitReview = async () => {
    if (!name || !text || rating === 0) return alert("Fill all fields!");
    const newReview = { name, text, rating };
    try {
await axios.post(`${API_BASE_URL}/api/reviews`, newReview);
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

  // ----------------- MAIN UI -----------------
  return (
    <div className="user-dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="photo-placeholder no-photo">👤</div>
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
          {/* ✅ Added login time here */}
          <p className="login-time">
            <strong>Last Login:</strong> {loginTime}
          </p>
        </div>

        <ul className="menu">
          {[
            "dashboard",
            "mycourses",
            "available",
            "certificates",
            "reviews",
            "settings",
          ].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="content-section">
            <h1>Welcome Back, {USER_NAME}!</h1>
            <p>Overview of your learning journey</p>

            {/* ✅ Added login time display */}
            <p className="login-time-banner">
              🕒 Logged in at: <strong>{loginTime}</strong>
            </p>

            <div className="card-grid">
              <div className="dash-card">
                <h3>My Courses</h3>
                <p>
                  {
                    enrolledPayments.filter((p) => p.status === "Approved")
                      .length
                  }{" "}
                  Enrolled
                </p>
              </div>
              <div className="dash-card">
                <h3>Available Courses</h3>
                <p>{courses.length} Total</p>
              </div>
              <div className="dash-card">
                <h3>Certificates</h3>
                <p>{completedCourses.length} Earned</p>
              </div>
            </div>
          </div>
        )}

        {/* AVAILABLE COURSES */}
        {activeTab === "available" && (
          <div className="content-section">
            <h2>Available Courses</h2>
            {courses.map((course) => {
              const isEnrolled = enrolledPayments.some(
                (p) => p.courseId === course._id
              );
              return (
                <div key={course._id} className="course-card">
                  <h4>{course.courseName}</h4>
                  <p>Videos: {course.videos?.length || 0}</p>
                  <p>Notes: {course.notes?.length || 0}</p>
                  <p>Quizzes: {course.quizzes?.length || 0}</p>
                  {isEnrolled ? (
                    <button disabled>Pending/Approved ✅</button>
                  ) : (
                    <button onClick={() => handleDummyEnroll(course._id)}>
                      Enroll & Pay (Test)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MY COURSES */}
        {activeTab === "mycourses" && (
          <div className="content-section">
            <h2>My Courses</h2>

            {enrolledPayments
              .filter((p) => p.status === "Approved")
              .map((payment) => {
                const course = courses.find((c) => c._id === payment.courseId);
                if (!course) return null;
                const progress = payment.progress || {};

                return (
                  <div key={payment._id} className="course-card">
                    <h3>{course.courseName}</h3>

                    {/* VIDEO */}
                    <div className="section-block">
                      <h4>🎥 Videos</h4>
                      {course.videos?.length > 0 ? (
                        <CoursePlayer
                          course={course}
                          user={{ id: USER_ID, name: USER_NAME }}
                          onVideoComplete={async () => {
                            await axios.put(
                              `https://clinigoal-server-side.onrender.com/api/payments/${payment._id}/progress`,
                              { "progress.videoWatched": true }
                            );
                            fetchEnrolledPayments();
                          }}
                        />
                      ) : (
                        <p>No videos available.</p>
                      )}
                    </div>

                    {/* NOTES */}
                    {progress.videoWatched && (
                      <div className="section-block">
                        <h4>📝 Notes</h4>
                        {course.notes?.length > 0 ? (
                          <button
                            onClick={() =>
                              window.open(course.notes[0].fileUrl, "_blank")
                            }
                          >
                            View Notes
                          </button>
                        ) : (
                          <p>No notes available.</p>
                        )}
                        <button
                          onClick={async () => {
                            await axios.put(
                              `http://localhost:5000/api/payments/${payment._id}/progress`,
                              { "progress.notesViewed": true }
                            );
                            fetchEnrolledPayments();
                          }}
                        >
                          Mark Notes as Read
                        </button>
                      </div>
                    )}

                    {/* ASSIGNMENT */}
                    {progress.notesViewed && (
                      <div className="section-block">
                        <h4>📤 Submit Assignment</h4>
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button
                          onClick={async () => {
                            const formData = new FormData();
                            formData.append("assignment", file);
                            await axios.post(
                              `http://localhost:5000/api/assignments/${USER_ID}/${course._id}`,
                              formData
                            );
                            await axios.put(
                              `http://localhost:5000/api/payments/${payment._id}/progress`,
                              { "progress.assignmentSubmitted": true }
                            );
                            alert("✅ Assignment Submitted!");
                            fetchEnrolledPayments();
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {/* QUIZ */}
                    {progress.assignmentSubmitted && (
                      <div className="section-block">
                        <h4>🧠 Quiz</h4>
                        <button
                          onClick={() =>
                            handleQuizSubmit(course._id, payment._id)
                          }
                          disabled={progress.completed}
                        >
                          {progress.completed ? "✅ Completed" : "Start Quiz"}
                        </button>
                      </div>
                    )}

                    {/* CERTIFICATE */}
                    {progress.completed && (
                      <div className="section-block">
                        <h4>🏅 Certificate</h4>
                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:5000/api/certificates/${USER_ID}/${course._id}`,
                              "_blank"
                            )
                          }
                        >
                          Download Certificate
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="content-section">
            <h2>Certificates</h2>
            {completedCourses.length === 0 && (
              <p>No certificates yet. Complete a quiz to earn one!</p>
            )}
          </div>
        )}

        {/* REVIEWS */}
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
            {reviews.map((r, i) => (
              <div className="review-item" key={i}>
                <h4>{r.name}</h4>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{ color: s <= r.rating ? "#f59e0b" : "#ccc" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="content-section">
            <h2>Profile Settings</h2>
            <div className="profile-form">
              <label>Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              <button onClick={handleSaveProfile}>Save Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
