import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { baseApiUrl } from "../ApiConfig";
import "./AddReply.css";
import { setReply } from "../../../../Api/Api";
import io from "socket.io-client";

const Endpoints = "http://localhost:8801";
var socket;

const AddReply = ({ questionId, onClose, isReplyModalOpen }) => {
  const [replyContent, setReplyContent] = useState("");
  const [notifyReply, setNotifyReply] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (users && notifyReply) {
      const replyData = {
        users: users,
        reply: notifyReply,
      };
      console.log("Updated replyData", replyData);

      if (user) {
        socket = io(Endpoints);
        socket.on("connect", () => {
          console.log("Socket connected");
          setSocketConnected(true);
        });
        socket.emit("setup", user);
        socket.emit("new reply", replyData);

        return () => {
          console.log("Disconnecting socket");
          socket.disconnect();
        };
      }
    }
  }, [users, notifyReply]);

  async function addReplyHandler(event) {
    try {
      event.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const headers = {
        "x-access-token": token,
      };

      const formData = new FormData();
      formData.append("reply", replyContent);

      if (replyImage) {
        formData.append("replyImage", replyImage);
      }

      const { data } = await setReply(questionId, formData, headers);
      if (data.success) {
        toast.success(data.message);
        setUser(data.reply.user);
        setUsers(data.users);
        setNotifyReply(data.reply);
        setReplyContent("");
        onClose();
      } else {
        console.error("Failed to add reply:", data.message);
        toast.error(data.message);
      }
    } catch (e) {
      console.error("Error during fetch:", e);
      toast.error("Failed to add reply. Please try again later.");
    }
  }

  return (
    isReplyModalOpen && (
      <div className="reply-full-screen-modal">
        <div className="reply-modal-content">
          <h1 className="reply-h1">Add Reply</h1>
          <form className="reply-form" onSubmit={addReplyHandler}>
            <label className="reply-label">
              Reply:
              <textarea
                className="reply-textarea"
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
              />
            </label>
            <label className="reply-label">
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setReplyImage(event.target.files[0])}
                className="reply-form-input"
              />
            </label>
            <button type="submit" className="reply-submit-button">
              Submit
            </button>
            <button
              type="button"
              className="reply-close-button"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddReply;
