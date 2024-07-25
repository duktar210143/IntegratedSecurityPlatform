// Updated GetAllUserQuestions.jsx

import {
  Heart,
  Reply,
  MessageCircleIcon,
  LucideMessageCircle,
  MessageSquareIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllQuestions } from "../../../../../Api/Api";
import { RecentAddedQuestion } from "../../../Providers/LatestQuestionContext";
import AddReply from "../../Reply/AddReply";
import "./GetAllUserQuestions.css"; // Updated import for funky styles
import ViewReply from "../../Reply/ViewReply";

const GetAllUserQuestions = ({
  onReplyClose,
  openReplyModal,
  isReplyModalOpen,
  openReplyViewModal,
  closeReplyViewModal,
  isReplyViewModalOpen,
}) => {
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

  const QuestionItem = ({ question }) => (
    <div className="question-item">
      <div className="user-profile">
        <img
          src={question.user.image}
          alt={question.user.firstname}
          className="profile-picture"
        />
      </div>
      <div className="question-content">
        <h3>{question.title}</h3>
        <p>{question.description}</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (!memoizedQuestions.length) {
      fetchUserSpecificQuestions();
    }
  }, [memoizedQuestions]);

  return (
    <div>
      {isLoading ? (
        <div className="funky-loading-spinner">
          <div className="funky-loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <ul className="funky-question-list">
          {question && question.length > 0 ? (
            question.map((addedQuestion) => (
              <li key={addedQuestion._id} className="funky-question-item">
                <div className="user-profile">
                  <img
                    src={addedQuestion.user.image}
                    className="profile-picture"
                  />
                </div>
                <div className="funky-question-header">
                  <h4>{addedQuestion.question}</h4>
                  <div className="funky-question-actions">
                    <div className="funky-vertical-line"></div>
                    <button className="funky-heart-button">
                      <Heart strokeWidth={1.5} />
                    </button>
                    <button
                      className="funky-reply-button"
                      type="submit"
                      onClick={() => openReplyModal(addedQuestion._id)}
                    >
                      <Reply strokeWidth={1.5} />
                    </button>
                    <button
                      className="ViewReplyButton"
                      type="submit"
                      onClick={() => openReplyViewModal(addedQuestion._id)}
                    >
                      <MessageSquareIcon strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="funky-question-description">
                  {addedQuestion.questionDescription}
                </p>
                <div className="funky-question-category">
                  <span className="funky-tag-icon">&#128278;</span>
                  {addedQuestion.questionCategory}
                </div>
                {addedQuestion.questionImageUrl && (
                  <img
                    src={addedQuestion.questionImageUrl}
                    alt={addedQuestion.question}
                    className="funky-question-image"
                  />
                )}
              </li>
            ))
          ) : (
            <div className="funky-no-questions-found">
              <p>No questions found. Ask a question to get started!</p>
            </div>
          )}
        </ul>
      )}
      {isReplyModalOpen && <AddReply onClose={onReplyClose} />}
      {isReplyViewModalOpen && <ViewReply onClose={closeReplyViewModal} />}
    </div>
  );
};

export default GetAllUserQuestions;
