import React, { useState, useEffect } from "react";
import { Home, LucideUserCircle } from "lucide-react";
import { Bell } from "lucide-react";
import { PenSquare } from "lucide-react";
import "./AppBar.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import NotificationBadge from "../Common/NotificationBadge";

const Endpoints = "http://localhost:8801";

const AppBar = (props) => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [replyData, setReplyData] = useState([]);
  const [showRepliesMenu, setShowRepliesMenu] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(Endpoints);
    socket.on("setup",(userId)=>{
      setLoggedInUserId(userId)
    })
    socket.on("new reply", (data) => {
      console.log(data);
      const { reply } = data;
      setReplyData((prevData) => [...prevData, data]);
      setHasNotifications(true);
      console.log("New reply added:", reply);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Reply data updated:", replyData);
    console.log("userId data:",loggedInUserId);
  }, [replyData,loggedInUserId]);

  const handleBellIconClick = () => {
    const filteredReplies = replyData.filter(reply => reply.user.id !== loggedInUserId);
  
    if (filteredReplies.length < 1) {
      setShowRepliesMenu(false);
    } else {
      setShowRepliesMenu(!showRepliesMenu);
    }
  
    setShowNotificationBadge(false);
    setHasNotifications(false);
    setReplyData(filteredReplies);
  };
  

  const clearNotification = () => {
    setReplyData([]);
    setShowNotificationBadge(false);
    setShowRepliesMenu(false);
    setHasNotifications(false);
  };

  return (
    <div className="AppBar" style={{ zIndex: 1000 }}>
      <div className="logoName">Discussion Forum</div>
      <div className="right-container">
        <div className="appbar-items">
          <button
            onClick={() => navigate("/publicDashboard")}
            className="button-reset"
          >
            <Home strokeWidth={1.5} color="black" style={{ opacity: 0.7 }} />
          </button>
        </div>
        <div className="appbar-items">
          <NotificationBadge count={hasNotifications ? replyData.length : 0} />

          <Bell
            strokeWidth={1.5}
            color={hasNotifications ? "red" : "black"}
            style={{ opacity: 0.7 }}
            onClick={handleBellIconClick}
          />
        </div>
        {showRepliesMenu && (
          <div className="replies-menu">
            {replyData.map((reply, index) => (
              <>
              <div key={index} className="reply-notify-items">
                <img
                  src={reply.user.image}
                  alt="User"
                  className="user-image-circle"
                />
                <div className="question-describe-controller">
                <div className="reply-text-static">Replied to</div>
                <div className="reply-text">{reply.question.question}</div>
                </div>
              </div>
              <div className="reply-user-name">{reply.user.firstname}</div>
              </>
            ))}
            <button className="clear-notify-button" onClick={clearNotification}>Clear</button>
          </div>
        )}
      </div>
      <div className="right-container-button">
        <button className="button-reset" onClick={props.openQuestionModal}>
          <div className="appbar-items">
            <div className="penSquare-icon">
              <PenSquare
                strokeWidth={1.5}
                color="black"
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>
        </button>
      </div>

      <div className="circleIcon-container">
        <button className="button-reset" onClick={() => navigate("/dashboard")}>
          <LucideUserCircle
            strokeWidth={1}
            style={{ opacity: 0.9, width: "40", height: "70" }}
          />
        </button>
      </div>
    </div>
  );
};

export default AppBar;
