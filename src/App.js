import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/SignUp";
import Dashboard from "./Pages/Home/Pages/Dashboard/Dashboard";
import SetProfile from "./Pages/Home/Pages/ProfileComponents/SetProfile";
import AddReply from "./Pages/Home/Pages/Reply/AddReply";
import { ToastContainer, toast } from "react-toastify";
import GetAllUserQuestions from "./Pages/Home/Pages/Question/public/GetAllUserQuestions";
import AppBar from "./Components/AppBar/AppBar";
import "react-toastify/dist/ReactToastify.css";
import { QuestionStateProvider } from "./Pages/Home/Providers/LatestQuestionContext";
import ViewReply from "./Pages/Home/Pages/Reply/ViewReply";
import AdminDashBoard from "./Pages/Home/Admin/AdminDashBoard";
import AdminAppBar from "./Pages/Home/Admin/AdminAppBar";
import ResetPasswordForm from "./Pages/Authentication/ResetPasswordForm";

const App = () => {
  // State to track whether the reply modal is currently open or closed
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // state to tract whether the replies view modal is currently open or closed
  const [isReplyViewModalOpen, setIsReplyViewModalOpen] = useState(false);

  // State to track the selected question ID
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // Function to open the reply modal
  const openReplyModal = (questionId) => {
    setIsReplyModalOpen(true);
    setSelectedQuestionId(questionId);
  };

  // Function to close the reply modal
  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedQuestionId(null);
  };

  // function to open the reply view modal
  const openReplyViewModal = (questionId) => {
    setIsReplyViewModalOpen(true);
    setSelectedQuestionId(questionId);
  };

  // function to close the reply view modal
  const closeReplyViewModal = (question) => {
    setIsReplyViewModalOpen(false);
    setSelectedQuestionId(null);
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<SetProfile />} />
        <Route path="/addReply" element={<AddReply />} />
        <Route
          path="/publicDashboard"
          element={
            <>
              <AppBar />
              <QuestionStateProvider>
                {/* Pass the necessary props to GetAllUserQuestions */}
                <GetAllUserQuestions
                  onReplyClose={closeReplyModal}
                  openReplyModal={openReplyModal}
                  isReplyOpen={isReplyModalOpen}
                  questionId={selectedQuestionId}
                  openReplyViewModal={openReplyViewModal}
                  closeReplyViewModal={closeReplyViewModal}
                  isReplyViewModalOpen={isReplyViewModalOpen}
                />

                <AddReply
                  onClose={closeReplyModal}
                  isReplyModalOpen={isReplyModalOpen}
                  questionId={selectedQuestionId}
                />
                <ViewReply
                  onClose ={closeReplyViewModal}
                  isReplyViewModalOpen = {isReplyViewModalOpen}
                  questionId={selectedQuestionId}
                />
              </QuestionStateProvider>
            </>
          }
        />
        <Route path="/viewReplies" element={<ViewReply />} />
        <Route path="/admin" element={
            <>
            <AdminAppBar/>
              <QuestionStateProvider>
                {/* Pass the necessary props to GetAllUserQuestions */}
                <AdminDashBoard
                  onReplyClose={closeReplyModal}
                  openReplyModal={openReplyModal}
                  isReplyOpen={isReplyModalOpen}
                  questionId={selectedQuestionId}
                  openReplyViewModal={openReplyViewModal}
                  closeReplyViewModal={closeReplyViewModal}
                  isReplyViewModalOpen={isReplyViewModalOpen}
                />
              </QuestionStateProvider>
            </>
          }></Route>
          <Route path="/resetPwForm" element={<ResetPasswordForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;
