import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";

const AdminNoteManagement = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [noteFile, setNoteFile] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Error fetching notes:", err);
      alert("Failed to load notes.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!noteFile) return alert("Please select a note file");

    const formData = new FormData();
    formData.append("note", noteFile);
    formData.append("title", title);
    formData.append("courseId", courseId);

    try {
      await axios.post(`${API_BASE_URL}/api/notes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Note uploaded successfully!");
      setTitle("");
      setCourseId("");
      setNoteFile(null);
      fetchNotes();
    } catch (err) {
      console.error("❌ Error uploading note:", err);
      alert("Failed to upload note.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`);
      alert("🗑️ Note deleted successfully!");
      fetchNotes();
    } catch (err) {
      console.error("❌ Error deleting note:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📘 Admin Note Management</h2>

      <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setNoteFile(e.target.files[0])}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Note
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">Uploaded Notes</h3>
        {notes.length === 0 ? (
          <p>No notes uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li
                key={n._id}
                className="p-3 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{n.title}</p>
                  <a
                    href={`https://clinigoal-server-side.onrender.com/${n.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminNoteManagement;
