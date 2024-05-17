import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RecentAddedQuestion } from "../../Providers/LatestQuestionContext";
import { getReplies } from "../../../../Api/Api";
import "./ViewReply.css"; // Import your CSS file for styling

const ViewReply = ({ questionId, onClose, isReplyViewModalOpen }) => {
  const [editQuestion, setEditQuestion] = useState({
    question: "",
    questionDescription: "",
    questionImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);

  const { question, setQuestion } = RecentAddedQuestion();

  async function getQuestionHandler() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:5500/api/questions/getUserQuestion/${questionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const fetchedData = await response.json();
      const { question, questionDescription, questionImageUrl } =
        fetchedData.question;

      setEditQuestion({
        question,
        questionDescription,
        questionImage: null,
      });
      setPreviewImage(questionImageUrl);
    } catch (e) {
      console.error("Error during fetch:", e);
    }
  }

  // get the userReplies
  const getQuestionReplies = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const headers = {
        "x-access-token": token,
      };

      const { data } = await getReplies(questionId, headers);
      console.log(data);

      if (data.success === true) {
        setReplies(data.replies || []);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching replies:", error.message || error);
      toast.error("An error occurred while fetching replies.");
    }
  };

  useEffect(() => {
    if (isReplyViewModalOpen) {
      getQuestionHandler();
      getQuestionReplies();
    }
  }, [isReplyViewModalOpen]);

  return (
    isReplyViewModalOpen && (
      <div className="view-full-screen-modal">
        <div className="view-modal-content">
          <h1 className="view-modal-title">Question</h1>
          <div className={`question-and-replies-container ${replies.length > 2 ? 'scrollable-replies' : ''}`}>
            {/* Display original question details */}
            <div className="original-question-details">
              <p>{editQuestion.question}</p>
              <p>{editQuestion.questionDescription}</p>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Question Preview"
                  className="view-preview-image"
                />
              )}
            </div>

            {/* Display replies */}
            <div className={`replies-container ${replies.length > 6 ? 'scrollable' : ''}`}>
              <div className="reply-title">Replies</div>
              {replies.map((reply) => (
                <div key={reply._id} className="reply-item">
                  <p>
                    <strong className="reply-username">{reply.user.firstname}</strong>
                    <div className="horizontal-line"/>
                    <div className="reply-content">{reply.reply}</div>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="view-modal-buttons">
            {loading ? (
              <div className="loading-spinner">
                <div className="loader"></div>
              </div>
            ) : (
              <button
                type="button"
                className="view-close-button"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ViewReply;
