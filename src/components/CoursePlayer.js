import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CoursePlayer({ course, user }) {
  const [currentStep, setCurrentStep] = useState("loading");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentAndProgress();
  }, []);

  const fetchPaymentAndProgress = async () => {
    try {
      setLoading(true);
      // Check if user payment is approved
      const paymentRes = await axios.get(`http://localhost:5000/api/payments?userId=${user.id}`);
      const approved = paymentRes.data.some((p) => p.courseId === course._id && p.status === "Approved");
      setPaymentApproved(approved);

      if (!approved) {
        setCurrentStep("awaitingApproval");
        setLoading(false);
        return;
      }

      // Fetch progress
      const res = await axios.get(`http://localhost:5000/api/progress?userId=${user.id}&courseId=${course._id}`);
      setProgress(res.data);

      // Determine next step
      if (res.data?.certificateGenerated) setCurrentStep("certificate");
      else if (res.data?.quizAttempts?.length > 0) setCurrentStep("quiz");
      else if (res.data?.assignmentSubmitted) setCurrentStep("quiz");
      else if (res.data?.notesViewed) setCurrentStep("assignment");
      else if (res.data?.videosWatched?.length === course.videos.length) setCurrentStep("notes");
      else setCurrentStep("videos");

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setCurrentStep("error");
    }
  };

  const handleVideoComplete = async () => {
    const videoId = course.videos[currentVideoIndex]._id;
    await axios.post("http://localhost:5000/api/progress/video", { userId: user.id, courseId: course._id, videoId });

    if (currentVideoIndex + 1 < course.videos.length) setCurrentVideoIndex(currentVideoIndex + 1);
    else setCurrentStep("notes");
    fetchPaymentAndProgress();
  };

  const handleNotesViewed = async () => {
    await axios.post("http://localhost:5000/api/progress/notes", { userId: user.id, courseId: course._id });
    setCurrentStep("assignment");
    fetchPaymentAndProgress();
  };

  const handleAssignmentSubmit = async () => {
    await axios.post("http://localhost:5000/api/progress/assignment", { userId: user.id, courseId: course._id });
    setCurrentStep("quiz");
    fetchPaymentAndProgress();
  };

  const handleQuizSubmit = async () => {
    const score = parseInt(prompt("Enter your quiz score (0-100):")); // for demo
    const res = await axios.post("http://localhost:5000/api/progress/quiz", { userId: user.id, courseId: course._id, score });
    if (res.data.passed) {
      alert("Quiz Passed! Generating certificate...");
      const certRes = await axios.post("http://localhost:5000/api/progress/certificate", { userId: user.id, courseId: course._id });
      setCertificateUrl(certRes.data.certificateUrl);
      setCurrentStep("certificate");
    } else if (res.data.remainingAttempts > 0) {
      alert(`Failed! Remaining attempts: ${res.data.remainingAttempts}`);
    } else {
      alert("No attempts left. Quiz failed.");
    }
    fetchPaymentAndProgress();
  };

  if (loading) return <p>Loading...</p>;

  if (currentStep === "awaitingApproval") return <p>✅ Payment received. Awaiting admin approval to access this course.</p>;
  if (currentStep === "error") return <p>❌ Error loading course. Please try again later.</p>;

  return (
    <div>
      <h2>{course.courseName}</h2>

      {currentStep === "videos" && (
        <div>
          <h3>Video {currentVideoIndex + 1} / {course.videos.length}</h3>
          <video
            width="600"
            controls
            onEnded={handleVideoComplete}
            src={course.videos[currentVideoIndex].url}
          />
        </div>
      )}

      {currentStep === "notes" && (
        <div>
          <h3>Notes</h3>
          <p>{course.notes.join("\n")}</p>
          <button onClick={handleNotesViewed}>Mark Notes as Read</button>
        </div>
      )}

      {currentStep === "assignment" && (
        <div>
          <h3>Assignment</h3>
          <button onClick={handleAssignmentSubmit}>Submit Assignment</button>
        </div>
      )}

      {currentStep === "quiz" && (
        <div>
          <h3>Quiz</h3>
          <button onClick={handleQuizSubmit}>Attempt Quiz</button>
        </div>
      )}

      {currentStep === "certificate" && (
        <div>
          <h3>Certificate</h3>
          <a href={certificateUrl} target="_blank" rel="noreferrer">Download Certificate</a>
        </div>
      )}
    </div>
  );
}
