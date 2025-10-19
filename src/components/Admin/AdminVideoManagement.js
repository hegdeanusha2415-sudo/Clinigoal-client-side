import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../apiConfig";

const AdminVideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error("❌ Failed to load videos:", err);
      alert("Failed to load videos. Please check backend connection.");
    }
  };

  // Upload new video
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("courseId", courseId);

    try {
      await axios.post(`${API_BASE_URL}/api/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Video uploaded successfully!");
      setTitle("");
      setCourseId("");
      setVideoFile(null);
      fetchVideos();
    } catch (err) {
      console.error("❌ Error uploading video:", err);
      alert("Failed to upload video");
    }
  };

  // Delete video
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/videos/${id}`);
      alert("🗑️ Video deleted successfully");
      fetchVideos();
    } catch (err) {
      console.error("❌ Error deleting video:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🎬 Admin Video Management</h2>

      <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Video Title"
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
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Video
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">Uploaded Videos</h3>
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {videos.map((v) => (
              <li
                key={v._id}
                className="p-3 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{v.title}</p>
                  {v.filePath && (
                    <video
                      controls
                      width="300"
                      src={`${API_BASE_URL.replace("/api", "")}/${v.filePath}`}
                    ></video>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(v._id)}
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

export default AdminVideoManagement;
