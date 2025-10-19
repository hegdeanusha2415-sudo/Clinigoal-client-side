import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";

const CoursePlayer = () => {
  const { id } = useParams(); // Course ID from URL
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState("none");

  // ✅ Fetch course with all videos, notes, and quizzes
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <div className="text-center p-6 text-gray-600">Loading course...</div>
    );
  }

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setSelectedNote(null);
    setSelectedQuiz(null);
    setActiveTab("video");
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setSelectedVideo(null);
    setSelectedQuiz(null);
    setActiveTab("note");
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setSelectedVideo(null);
    setSelectedNote(null);
    setActiveTab("quiz");
  };

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-semibold mb-6 text-blue-700">
        🎓 {course.courseName || course.title}
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT PANEL - COURSE CONTENT LIST */}
        <div className="md:w-1/3 bg-gray-50 rounded-2xl shadow-md p-4">
          <h3 className="text-xl font-bold mb-3 text-gray-700">📚 Course Content</h3>

          <div className="space-y-4">
            {/* VIDEOS LIST */}
            {course.videos?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-600 mb-2">🎥 Videos</h4>
                <ul className="space-y-2">
                  {course.videos.map((v, index) => (
                    <li
                      key={v._id || index}
                      onClick={() => handleVideoSelect(v)}
                      className={`cursor-pointer p-2 rounded-lg ${
                        selectedVideo === v ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      {v.title || v.url.split("/").pop()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NOTES LIST */}
            {course.notes?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-600 mb-2 mt-4">📝 Notes</h4>
                <ul className="space-y-2">
                  {course.notes.map((n, index) => (
                    <li
                      key={n._id || index}
                      onClick={() => handleNoteSelect(n)}
                      className={`cursor-pointer p-2 rounded-lg ${
                        selectedNote === n ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      {n.title || n.originalName || n.filename}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* QUIZZES LIST */}
            {course.quizzes?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-600 mb-2 mt-4">🧠 Quizzes</h4>
                <ul className="space-y-2">
                  {course.quizzes.map((q, index) => (
                    <li
                      key={q._id || index}
                      onClick={() => handleQuizSelect(q)}
                      className={`cursor-pointer p-2 rounded-lg ${
                        selectedQuiz === q ? "bg-blue-100" : "hover:bg-gray-100"
                      }`}
                    >
                      {q.title || `Quiz ${index + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - PLAYER / VIEWER */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-6">
          {/* VIDEO PLAYER */}
          {activeTab === "video" && selectedVideo && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                🎥 Playing: {selectedVideo.title || selectedVideo.url.split("/").pop()}
              </h4>
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="w-full rounded-xl shadow-md"
              />
            </div>
          )}

          {/* NOTES VIEWER */}
          {activeTab === "note" && selectedNote && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                📝 Viewing: {selectedNote.originalName || selectedNote.filename}
              </h4>
              <iframe
                src={selectedNote.url}
                title="Note PDF"
                className="w-full h-[600px] rounded-xl border"
              ></iframe>
            </div>
          )}

          {/* QUIZ VIEWER */}
          {activeTab === "quiz" && selectedQuiz && (
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                🧠 Quiz Section
              </h4>

              {selectedQuiz.questions?.length > 0 ? (
                <div className="space-y-6">
                  {selectedQuiz.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border rounded-lg bg-gray-50">
                      <p className="font-medium text-gray-700 mb-2">
                        {qIndex + 1}. {q.questionText}
                      </p>
                      <ul className="space-y-1">
                        {q.options.map((opt, oIndex) => (
                          <li
                            key={oIndex}
                            className="p-2 bg-white rounded-md border hover:bg-blue-50"
                          >
                            {opt.optionText}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No questions found for this quiz.</p>
              )}
            </div>
          )}

          {/* DEFAULT PLACEHOLDER */}
          {activeTab === "none" && (
            <div className="text-center text-gray-500">
              Select a video, note, or quiz to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
