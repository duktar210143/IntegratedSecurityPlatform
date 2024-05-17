import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteQuestion, fetchAllQuestions } from "../../../Api/Api";
import { RecentAddedQuestion } from "../Providers/LatestQuestionContext";
import { Link } from "react-router-dom";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const { question, setQuestion } = RecentAddedQuestion();
  const [isLoading, setIsLoading] = useState(true);

  const memoizedQuestions = useMemo(() => question, [question]);

  async function fetchUserSpecificQuestions() {
    try {
      const { data } = await fetchAllQuestions();

      if (data.success) {
        const reversedQuestions = data.questions
          ? data.questions.reverse()
          : [];
        setQuestion(reversedQuestions);
      } else {
        throw new Error(data.message || "Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error.message || error);
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

  const handleClickUser = (userId) => {
    navigate(`/dashboard`);
  };

  async function handleDelete(questionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("token not found ");
        return;
      }

      // Display confirmation toast
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
    } catch (e) {
      console.error("Error during deleting the question:", e);
    }
  }

  async function confirmDelete(questionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token not found ");
        return;
      }
  
      const headers = {
        "x-access-token": token,
      };
  
      const { data } = await deleteQuestion(questionId, headers);
  
      if (data.success === true) {
        setQuestion((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );
  
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.error("Error during deleting the question:", e);
    }
  }
  

  return (
    <div className="admin-dashboard-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Question</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {question && question.length > 0 ? (
              question.map((addedQuestion) => (
                <tr key={addedQuestion._id}>
                  <td>
                    <div
                      className="admin-user-profile"
                      onClick={() => handleClickUser(addedQuestion.user._id)}
                    >
                      <img
                        src={addedQuestion.user.image}
                        alt={addedQuestion.user.firstname}
                        className="user-profile-image"
                      />
                      <span>{addedQuestion.user.firstname}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-question-content">
                      <div>
                        <h4>{addedQuestion.question}</h4>
                        <p>{addedQuestion.questionDescription}</p>
                      </div>
                      <div className="admin-question-category">
                        <span>&#128278;</span>
                        {addedQuestion.questionCategory}
                      </div>
                      {addedQuestion.questionImageUrl && (
                        <img
                          src={addedQuestion.questionImageUrl}
                          alt={addedQuestion.question}
                          className="admin-question-image"
                        />
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        onClick={() => handleDelete(addedQuestion._id)}
                        className="admin-delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  No questions found. Ask a question to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashBoard;
