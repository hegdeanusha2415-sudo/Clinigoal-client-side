import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCourseManagement.css";

function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([
    { question: "", options: ["", "", "", ""], correctOption: 0, image: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // ✅ Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      alert("Failed to load courses. Check server connection.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Add new quiz field dynamically
  const handleAddQuizField = () =>
    setQuizzes([
      ...quizzes,
      { question: "", options: ["", "", "", ""], correctOption: 0, image: null },
    ]);

  // ✅ Handle quiz change
  const handleQuizChange = (e, index, optionIndex = null) => {
    const { name, value, files } = e.target;
    const updatedQuizzes = [...quizzes];

    if (name === "question") updatedQuizzes[index].question = value;
    else if (name.startsWith("option") && optionIndex !== null)
      updatedQuizzes[index].options[optionIndex] = value;
    else if (name === "correctOption")
      updatedQuizzes[index].correctOption = parseInt(value);
    else if (name === "image") updatedQuizzes[index].image = files[0];

    setQuizzes(updatedQuizzes);
  };

  const handleVideoChange = (e) => setVideos([...e.target.files]);
  const handleNoteChange = (e) => setNotes([...e.target.files]);

  // ✅ Add / Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return alert("Please select a course name!");
    if (videos.length === 0) return alert("Upload at least one video!");
    if (notes.length === 0) return alert("Upload at least one note!");

    const formData = new FormData();
    formData.append("courseName", selectedCourse);
    videos.forEach((v) => formData.append("videos", v));
    notes.forEach((n) => formData.append("notes", n));

    quizzes.forEach((q, i) => {
      formData.append(`quizzes[${i}][question]`, q.question);
      q.options.forEach((opt, idx) =>
        formData.append(`quizzes[${i}][options][${idx}]`, opt)
      );
      formData.append(`quizzes[${i}][correctOption]`, q.correctOption);
      if (q.image) formData.append(`quizzes[${i}][image]`, q.image);
    });

    setLoading(true);

    try {
      if (editMode) {
        await axios.put(
          `https://clinigoal-server-side.onrender.com/api/courses/${editCourseId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Course updated successfully!");
      } else {
        await axios.post("https://clinigoal-server-side.onrender.com/api/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Course added successfully!");
      }

      // Reset form
      setSelectedCourse("");
      setVideos([]);
      setNotes([]);
      setQuizzes([
        { question: "", options: ["", "", "", ""], correctOption: 0, image: null },
      ]);
      setEditMode(false);
      setEditCourseId(null);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err.response?.data || err.message);
      alert("❌ Failed to save course. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit a course
  const handleEdit = (course) => {
    setSelectedCourse(course.courseName);
    setEditCourseId(course._id);
    setEditMode(true);
  };

  // ✅ Delete a course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`https://clinigoal-server-side.onrender.com/api/courses/${id}`);
      alert("🗑️ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("❌ Failed to delete course.");
    }
  };

  // ✅ Toggle view
  const toggleView = (id) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  return (
    <div className="course-management">
      <h2>📚 Course Management Dashboard</h2>

      {/* ---------------- FORM SECTION ---------------- */}
      <form
        onSubmit={handleSubmit}
        className="course-form"
        encType="multipart/form-data"
      >
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

        <div className="form-group">
          <label>Upload Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
          />
          {videos.length > 0 && (
            <p className="file-count">{videos.length} video(s) selected</p>
          )}
        </div>

        <div className="form-group">
          <label>Upload Notes</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleNoteChange}
          />
          {notes.length > 0 && (
            <p className="file-count">{notes.length} note(s) selected</p>
          )}
        </div>

        <div className="form-group quiz-section">
          <label>Quizzes</label>
          {quizzes.map((q, i) => (
            <div key={i} className="quiz-card">
              <input
                type="text"
                name="question"
                value={q.question}
                placeholder={`Question ${i + 1}`}
                onChange={(e) => handleQuizChange(e, i)}
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
          <button
            type="button"
            onClick={handleAddQuizField}
            className="add-quiz-btn"
          >
            + Add Quiz
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading
            ? editMode
              ? "Updating..."
              : "Adding..."
            : editMode
            ? "Update Course"
            : "Add Course"}
        </button>
      </form>

      {/* ---------------- COURSE LIST SECTION ---------------- */}
      <h3 className="course-list-title">📋 Uploaded Courses</h3>

      <div className="course-list">
        {courses.length === 0 ? (
          <p className="no-course">No courses found yet.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <h4>{course.courseName}</h4>
                <p>
                  {course.videos?.length || 0} videos |{" "}
                  {course.notes?.length || 0} notes
                </p>
              </div>

              <div className="button-group">
                <button
                  onClick={() => toggleView(course._id)}
                  className="view-btn"
                >
                  {expandedCourse === course._id ? "👁️ Hide" : "👁️ View"}
                </button>
                <button
                  onClick={() => handleEdit(course)}
                  className="edit-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>

              {expandedCourse === course._id && (
                <div className="course-details">
                  <h5>🎥 Videos:</h5>
                  <ul>
                    {course.videos?.length > 0 ? (
                      course.videos.map((v, idx) => (
                        <li key={idx}>
                          {typeof v === "string"
                            ? v
                            : v.filename || v.name || `Video ${idx + 1}`}
                        </li>
                      ))
                    ) : (
                      <li>No videos available</li>
                    )}
                  </ul>

                  <h5>📄 Notes:</h5>
                  <ul>
                    {course.notes?.length > 0 ? (
                      course.notes.map((n, idx) => (
                        <li key={idx}>
                          {typeof n === "string"
                            ? n
                            : n.filename || n.name || `Note ${idx + 1}`}
                        </li>
                      ))
                    ) : (
                      <li>No notes available</li>
                    )}
                  </ul>

                  <h5>🧠 Quizzes:</h5>
                  <ul>
                    {course.quizzes?.length > 0 ? (
                      course.quizzes.map((q, idx) => (
                        <li key={idx}>
                          <strong>Q{idx + 1}:</strong> {q.question}
                        </li>
                      ))
                    ) : (
                      <li>No quizzes available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCourseManagement;
