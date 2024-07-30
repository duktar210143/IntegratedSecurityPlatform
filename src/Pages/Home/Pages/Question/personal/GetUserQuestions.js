import { Heart, LucideDelete, Pencil } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchQuestion, deleteQuestion } from "../../../../../Api/Api";
import { RecentAddedQuestion } from "../../../Providers/LatestQuestionContext";
import "./GetUserQuestions.css";
import EditUserQuestion from "./EditUserQuestions";

const GetUserQuestions = ({ isEditOpen, onEditClose, openEditModal }) => {
  const navigate = useNavigate();
  const { question, setQuestion } = RecentAddedQuestion();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  const memoizedQuestions = useMemo(() => question, [question]);

  async function fetchUserSpecificQuestions() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        "x-access-token": token,
      };

      const { data } = await fetchQuestion(headers);

      if (data.success === true) {
        const reversedQuestions = data.questions
          ? data.questions.reverse()
          : [];
        setQuestion(reversedQuestions);
        setIsLoading(false);
      } else {
        console.error(data.error);
        toast.error("An error occurred while fetching the questions.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching the questions.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!memoizedQuestions.length) {
      fetchUserSpecificQuestions();
    }
  }, [memoizedQuestions]);

  async function handleDelete(questionId) {
    console.log("handleDelete called");
    toast.info(
      <div className="custom-toast">
        <p>Are you sure you want to delete this question?</p>
        <button className="yes" onClick={() => confirmDelete(questionId)}>
          Yes
        </button>
        <button
          className="no"
          onClick={() => {
            toast.dismiss(); // Close the toast
            setDeleteDialogOpen(false); // Close the dialog
          }}
        >
          No
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        hideProgressBar: true,
      }
    );
  }

  async function confirmDelete(questionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token not found ");
        return;
      }

      const headers = {
        "x-access-token": token,
      };

      const { data } = await deleteQuestion(questionId, headers);

      if (data.success === true) {
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

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.error("Error during deleting the question:", e);
    } finally {
      setDeletingQuestionId(null);
      setTimeout(() => {
        toast.dismiss(); // Close the toast after delay
        setDeleteDialogOpen(false); // Close the dialog after delay
      }, 2000); // Delay in milliseconds
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={false}
        closeOnClick={false}
        draggable
        hideProgressBar
        toastClassName="custom-toast"
      />
      {isLoading ? (
        <div className="loading-spinner">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <ul className="question-list">
          {question && question.length > 0 ? (
            question.map((addedQuestion) => (
              <li key={addedQuestion._id} className="question-item">
                <div className="question-header">
                  <h4>{addedQuestion.question}</h4>
                  <div className="question-actions">
                    <div className="vertical-line"></div>
                    <button className="heart-button">
                      <Heart strokeWidth={1.5} />
                    </button>
                    <button
                      className="edit-button"
                      type="submit"
                      onClick={() => openEditModal(addedQuestion._id)}
                    >
                      <Pencil strokeWidth={1.5} />
                    </button>
                    <button
                      className="delete-button"
                      type="submit"
                      onClick={() => handleDelete(addedQuestion._id)}
                    >
                      <LucideDelete strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="question-description">
                  {addedQuestion.questionDescription}
                </p>
                <div className="question-category">
                  <span className="tag-icon">&#128278;</span>
                  {/* Tag icon */}
                  {addedQuestion.questionCategory}
                </div>
                {addedQuestion.questionImageUrl && (
                  <img
                    src={addedQuestion.questionImageUrl}
                    alt={addedQuestion.question}
                    className="question-image"
                  />
                )}
              </li>
            ))
          ) : (
            <div className="no-questions-found">
              <p>No questions found. Ask a question to get started!</p>
            </div>
          )}
        </ul>
      )}
      {/* open edit modal if the edit state is true or close it */}
      {isEditOpen && <EditUserQuestion onClose={onEditClose} />}
    </div>
  );
};

export default GetUserQuestions;
