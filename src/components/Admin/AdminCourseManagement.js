import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ALL COURSES ---------------- */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      alert("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ---------------- CREATE / UPDATE COURSE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !instructor || !price || !description) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    const courseData = { title, instructor, price, description };

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/courses/${editId}`, courseData);
        alert("✅ Course updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/courses`, courseData);
        alert("✅ Course added successfully!");
      }

      // Reset form
      setTitle("");
      setInstructor("");
      setPrice("");
      setDescription("");
      setEditId(null);
      fetchCourses();
    } catch (err) {
      console.error("❌ Error saving course:", err);
      alert("Failed to save course.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE COURSE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
      alert("🗑️ Course deleted successfully!");
      fetchCourses();
    } catch (err) {
      console.error("❌ Error deleting course:", err);
      alert("Failed to delete course.");
    }
  };

  /* ---------------- EDIT COURSE ---------------- */
  const handleEdit = (course) => {
    setEditId(course._id);
    setTitle(course.title);
    setInstructor(course.instructor);
    setPrice(course.price);
    setDescription(course.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📚 Admin Course Management</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col gap-3 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Instructor Name"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editId ? "Update Course" : "Add Course"}
        </button>
      </form>

      {/* Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Courses</h3>

        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Instructor</th>
                <th className="p-2">Price</th>
                <th className="p-2">Description</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.instructor}</td>
                  <td className="p-2">₹{c.price}</td>
                  <td className="p-2">{c.description}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-400 px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
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

export default AdminCourseManagement;
