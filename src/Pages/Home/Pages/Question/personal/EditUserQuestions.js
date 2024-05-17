import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RecentAddedQuestion } from "../../../Providers/LatestQuestionContext";
import "./EditUserQuestion.css";

const EditUserQuestion = ({ questionId, onClose, isEditOpen }) => {
  const [editQuestion, setEditQuestion] = useState({
    question: "",
    questionDescription: "",
    questionImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const { question, setQuestion } = RecentAddedQuestion();

  async function getEditModal() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `https://localhost:5500/api/questions/getUserQuestion/${questionId}`,
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setEditQuestion({
      ...editQuestion,
      questionImage: file,
    });
    setPreviewImage(URL.createObjectURL(file));
  };

  async function editQuestionHandler(event) {
    try {
      event.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      setLoading(true); // Set loading to true when submitting

      const formData = new FormData();
      formData.append("question", editQuestion.question);
      formData.append("questionDescription", editQuestion.questionDescription);
      formData.append("questionImage", editQuestion.questionImage);

      const response = await fetch(
        `https://localhost:5500/api/questions/updateUserQuestion/${questionId}`,
        {
          method: "PUT",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (responseData.success === false) {
        console.error(`HTTP error! Status: ${responseData.status}`);
        console.log("Failed to edit the question");
        toast.error(responseData.message);
        return;
      } else {
        console.log("Question Edited successfully");
        toast.success(responseData.message);

        // Fetch the updated list of questions after updating
        const updatedQuestionsResponse = await fetch(
          "https://localhost:5500/api/questions/getQuestions",
          {
            method: "GET",
            headers: {
              "x-access-token": token,
            },
          }
        );

        const updatedData = await updatedQuestionsResponse.json();

        if (updatedData.success === true) {
          setQuestion(updatedData.questions.reverse());
        }

        onClose();
      }
    } catch (e) {
      console.error("Error during fetch:", e);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }

  useEffect(() => {
    if (isEditOpen) {
      getEditModal();
    }
  }, [isEditOpen]);

  return (
    isEditOpen && (
      <div className="edit-full-screen-modal">
        <div className="edit-modal-content">
          <h1 className="edit-modal-title">Edit Question</h1>
          <form onSubmit={editQuestionHandler}>
            <label className="edit-modal-label">
              Question:
              <textarea
                className="edit-modal-textarea"
                placeholder="Ask your question..."
                value={editQuestion.question}
                onChange={(event) =>
                  setEditQuestion({
                    ...editQuestion,
                    question: event.target.value,
                  })
                }
              />
            </label>
            <label className="edit-modal-label">
              Question Description:
              <textarea
                className="edit-modal-textarea"
                placeholder="Add description..."
                value={editQuestion.questionDescription}
                onChange={(event) =>
                  setEditQuestion({
                    ...editQuestion,
                    questionDescription: event.target.value,
                  })
                }
              />
            </label>
            <label className="edit-modal-label">Question Image:</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Question Preview"
                className="edit-preview-image"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="edit-file-input"
            />
            <div className="edit-modal-buttons">
              {loading ? (
                <div className="loading-spinner">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  <button type="submit" className="edit-submit-button">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="edit-close-button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditUserQuestion;
