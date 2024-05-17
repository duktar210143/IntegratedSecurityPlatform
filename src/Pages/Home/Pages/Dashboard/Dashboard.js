import React, { useState } from "react";
import AppBar from "../../../../Components/AppBar/AppBar";
// import provider from profile image provider
import { ProfileImageProvider } from "../../Providers/ProfileImageContext";

// import question state provider
import { QuestionStateProvider } from "../../Providers/LatestQuestionContext";

import GetProfile from "../ProfileComponents/GetProfile";
import SetProfile from "../ProfileComponents/SetProfile";
import SetUserQuestions from "../Question/personal/SetUserQuestions";
import GetUserQuestions from "../Question/personal/GetUserQuestions";
import EditUserQuestion from "../Question/personal/EditUserQuestions";
import AddReply from "../Reply/AddReply";
import "./Dashboard.css";

const Dashboard = () => {
  // State to track whether the question modal is currently open or closed
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);

  // State to track whether the edit modal is currently open or closed
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // state to track whether the reply modal is currently open or closed
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);



  const openQuestionModal = (event) => {
    event.preventDefault();
    setIsQuestionsModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionsModalOpen(false);
  };

  const openEditModal = (questionId) => {
    setIsEditModalOpen(true);
    setSelectedQuestionId(questionId);
    console.log(questionId);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openReplyModal = (questionId) => {
    setIsReplyModalOpen(true);
    setSelectedQuestionId(questionId);
  }


const closeReplyModal = () => {
  setIsReplyModalOpen(false);
}

  return (
    <div className="dashboard-container">
      {/* // Render the AppBar component with a prop to open the question modal when a specific action is triggered */}
      <AppBar openQuestionModal={openQuestionModal} />
      <ProfileImageProvider>
        <GetProfile />
        <SetProfile />
      </ProfileImageProvider>

      {/* wrap the question components with providers to share state amongst components */}
      <QuestionStateProvider>
        {/* // Render the SetUserQuestions component with isOpen and onClose props
// isOpen: Indicates whether the questions modal is open or closed
// onClose: Callback function to close the questions modal*/}
        <SetUserQuestions
          isOpen={isQuestionsModalOpen}
          onClose={closeQuestionModal}
        />
        {/* // Render the GetUserQuestions component with props to control whether the edit modal is open and to handle its closure */}
        <GetUserQuestions
          openEditModal={openEditModal}
          isEditOpen={isEditModalOpen}
          onEditClose={closeEditModal}
          onReplyClose={ closeReplyModal}
          openReplyModal={openReplyModal}
          questionId={selectedQuestionId}
          isReplyOpen={isReplyModalOpen}
        />

        <EditUserQuestion
          onClose={closeEditModal}
          isEditOpen={isEditModalOpen}
          questionId={selectedQuestionId}
        />

        <AddReply
        onClose={closeReplyModal}
        isReplyModalOpen = {isReplyModalOpen}
        questionId={selectedQuestionId}
        />

      </QuestionStateProvider>

    </div>
  );
};

export default Dashboard;
