import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";

const AdminQuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ALL QUIZZES ---------------- */
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err);
      alert("Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  /* ---------------- SUBMIT QUIZ ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !courseId || !correctAnswer || options.some((o) => !o)) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    const quizData = { question, options, correctAnswer, courseId };

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/quizzes/${editId}`, quizData);
        alert("✅ Quiz updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/quizzes`, quizData);
        alert("✅ Quiz added successfully!");
      }

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setCourseId("");
      setEditId(null);
      fetchQuizzes();
    } catch (err) {
      console.error("❌ Error saving quiz:", err);
      alert("Failed to save quiz. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE QUIZ ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/quizzes/${id}`);
      alert("🗑️ Quiz deleted successfully!");
      fetchQuizzes();
    } catch (err) {
      console.error("❌ Error deleting quiz:", err);
      alert("Failed to delete quiz.");
    }
  };

  /* ---------------- EDIT QUIZ ---------------- */
  const handleEdit = (quiz) => {
    setEditId(quiz._id);
    setQuestion(quiz.question);
    setOptions(quiz.options);
    setCorrectAnswer(quiz.correctAnswer);
    setCourseId(quiz.courseId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- UPDATE OPTION ---------------- */
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🧠 Admin Quiz Management</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="p-2 border rounded"
          required
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            className="p-2 border rounded"
            required
          />
        ))}

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Correct Answer</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt || `Option ${idx + 1}`}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? "Update Quiz" : "Add Quiz"}
        </button>
      </form>

      {/* Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Quizzes</h3>

        {loading ? (
          <p>Loading...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Question</th>
                <th className="p-2">Options</th>
                <th className="p-2">Correct Answer</th>
                <th className="p-2">Course ID</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q._id} className="border-t">
                  <td className="p-2">{q.question}</td>
                  <td className="p-2">{q.options.join(", ")}</td>
                  <td className="p-2 font-semibold text-green-700">
                    {q.correctAnswer}
                  </td>
                  <td className="p-2">{q.courseId}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleEdit(q)}
                      className="bg-yellow-400 px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminQuizManagement;
