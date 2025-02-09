import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecentAddedQuestion } from "../../../Providers/LatestQuestionContext";
import jwt from "jsonwebtoken";
import { createQuestion, fetchQuestion } from "../../../../../Api/Api";
import { toast } from "react-toastify";
import "./SetUserQuestions.css";

const SetUserQuestions = ({ isOpen, onClose }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const { question, setQuestion } = RecentAddedQuestion();
  const navigate = useNavigate();

  const handleQuestionChange = (event) => {
    setNewQuestion(event.target.value);
  };


  const handleDescriptionChange = (event) => {
    setQuestionDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreviewImage("");
    }

    setQuestionImage(file);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true); // Set loading to true when submitting

      const formData = new FormData();
      formData.append("question", newQuestion);
      formData.append("questionDescription", questionDescription);
      formData.append("questionImage", questionImage);

      const headers = {
        "x-access-token": token,
      };

      const { data } = await createQuestion(formData, headers);

      if (!data.success) {
        throw new Error(data.message || "Failed to post question.");
      } else {
        const fetchedData = await fetchQuestion(headers);

        setQuestion(fetchedData);
        setNewQuestion("");
        setQuestionDescription("");
        setQuestionImage(null);
        setPreviewImage("");
        onClose();
      }
    } catch (error) {
      console.error("An error occurred while posting the question:", error);
      toast.error("Failed to post question. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    isOpen && (
      <div className="full-screen-modal">
        <div className="modal-content larger-form">
        <label className="custom-file-upload">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {postImage ? "Change Image" : "Select Post Image"}
          </label>
          {previewImage && (
            <img className="preview-image" src={previewImage} alt="Preview" />
          )}
          <textarea
            placeholder="Ask your question..."
            value={newQuestion}
            onChange={handleQuestionChange}
            className="larger-text"
          />
          <textarea
            placeholder="Description"
            value={questionDescription}
            onChange={handleDescriptionChange}
            className="larger-text"
          />
          
          <div className="button-container">
            {loading ? (
              <div className="loading-spinner">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                <button
                  className="submit-button larger-button"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="close-button larger-button"
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default SetUserQuestions;
