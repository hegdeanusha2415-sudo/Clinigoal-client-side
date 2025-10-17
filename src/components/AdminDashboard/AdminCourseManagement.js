// src/components/AdminDashboard/AdminCourseManagement.js
import React, { useState } from "react";
import axios from "axios";
import "./AdminCourseManagement.css";

function AdminCourseManagement() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([
    { question: "", options: ["", "", "", ""], correctOption: 0, image: null },
  ]);
  const [loading, setLoading] = useState(false);

  // Add new quiz
  const handleAddQuizField = () =>
    setQuizzes([...quizzes, { question: "", options: ["", "", "", ""], correctOption: 0, image: null }]);

  // Handle quiz change
  const handleQuizChange = (e, index, optionIndex = null) => {
    const { name, value, files } = e.target;
    const updatedQuizzes = [...quizzes];

    if (name === "question") {
      updatedQuizzes[index].question = value;
    } else if (name.startsWith("option") && optionIndex !== null) {
      updatedQuizzes[index].options[optionIndex] = value;
    } else if (name === "correctOption") {
      updatedQuizzes[index].correctOption = parseInt(value);
    } else if (name === "image") {
      updatedQuizzes[index].image = files[0];
    }

    setQuizzes(updatedQuizzes);
  };

  const handleVideoChange = (e) => setVideos([...e.target.files]);
  const handleNoteChange = (e) => setNotes([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Please select a course!");
    if (videos.length === 0) return alert("Upload at least one video!");
    if (notes.length === 0) return alert("Upload at least one note!");

    const formData = new FormData();
    formData.append("courseName", selectedCourse);

    videos.forEach((v) => formData.append("videos", v));
    notes.forEach((n) => formData.append("notes", n));

    quizzes.forEach((q, i) => {
      formData.append(`quizzes[${i}][question]`, q.question);
      q.options.forEach((opt, idx) => formData.append(`quizzes[${i}][options][${idx}]`, opt));
      formData.append(`quizzes[${i}][correctOption]`, q.correctOption);
      if (q.image) formData.append(`quizzes[${i}][image]`, q.image);
    });

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Course added successfully!");
      console.log(res.data);

      // Reset form
      setSelectedCourse("");
      setVideos([]);
      setNotes([]);
      setQuizzes([{ question: "", options: ["", "", "", ""], correctOption: 0, image: null }]);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add course. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-management">
      <h2>📚 Course Management</h2>
      <form onSubmit={handleSubmit} className="course-form" encType="multipart/form-data">
        
        {/* Course Selection */}
        <div className="form-group">
          <label>Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            <option value="Clinical">Clinical</option>
            <option value="Bioinformatics">Bioinformatics</option>
            <option value="Paramedical">Paramedical</option>
            <option value="Medical Coding">Medical Coding</option>
          </select>
        </div>

        {/* Upload Videos */}
        <div className="form-group">
          <label>Upload Videos</label>
          <input type="file" multiple accept="video/*" onChange={handleVideoChange} />
          {videos.length > 0 && <p>{videos.length} video(s) selected</p>}
        </div>

        {/* Upload Notes */}
        <div className="form-group">
          <label>Upload Notes</label>
          <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleNoteChange} />
          {notes.length > 0 && <p>{notes.length} note(s) selected</p>}
        </div>

        {/* Quizzes */}
        <div className="form-group">
          <label>Quizzes</label>
          {quizzes.map((q, i) => (
            <div key={i} className="quiz-card">
              <input
                type="text"
                name="question"
                value={q.question}
                placeholder={`Question ${i + 1}`}
                onChange={(e) => handleQuizChange(e, i)}
                className="quiz-input"
                required
              />
              {q.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  name={`option${idx}`}
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleQuizChange(e, i, idx)}
                  required
                />
              ))}
              <input
                type="number"
                name="correctOption"
                min="0"
                max="3"
                value={q.correctOption}
                onChange={(e) => handleQuizChange(e, i)}
                placeholder="Correct Option (0-3)"
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleQuizChange(e, i)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddQuizField} className="add-quiz-btn">
            + Add Quiz
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding Course..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}

export default AdminCourseManagement;
