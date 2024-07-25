import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api, { deleteQuestion, fetchAllQuestions } from "../../../Api/Api";
import { RecentAddedQuestion } from "../Providers/LatestQuestionContext";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const { question, setQuestion } = RecentAddedQuestion();
  const [isLoading, setIsLoading] = useState(true);
  const [showUserActivity, setShowUserActivity] = useState(false);
  const [userActivityLogs, setUserActivityLogs] = useState([]);

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

  async function fetchUserActivityLogs() {
    try {
      // Fetch user activity logs from the server
      const { data } = await Api.get("/admin/user-activity-logs");
      console.log(data);
      if (data.success) {
        setUserActivityLogs(data.logs);
        setShowUserActivity(true);
      } else {
        throw new Error(data.message || "Failed to fetch user activity logs.");
      }
    } catch (error) {
      console.error("Error fetching user activity logs:", error.message || error);
      toast.error("An error occurred while fetching user activity logs.");
    }
  }

  return (
    <div className="admin-dashboard-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={fetchUserActivityLogs}>See User Activity</button>
          {showUserActivity && (
            <div>
              <h2>User Activity Logs</h2>
              <div className="user-activity-logs">
                {userActivityLogs.map((log) => {
                  const timestamp = new Date(log.timestamp).toLocaleString();
                  const username = log.message.match(/Username: (.+?)\n/)?.[1];
                  const sessionId = log.message.match(/Session ID: (.+?)\n/)?.[1];
                  const url = log.message.match(/URL: (.+?)\n/)?.[1];
                  const method = log.message.match(/Method: (.+?)$/)?.[1];

                  return (
                    username &&
                    sessionId &&
                    url &&
                    method && (
                      <div key={log._id} className="user-activity-log">
                        <p>
                          <strong>Timestamp:</strong> {timestamp}
                        </p>
                        <p>
                          <strong>Username:</strong> {username}
                        </p>
                        <p>
                          <strong>Session ID:</strong> {sessionId}
                        </p>
                        <p>
                          <strong>URL:</strong> {url}
                        </p>
                        <p>
                          <strong>Method:</strong> {method}
                        </p>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;
