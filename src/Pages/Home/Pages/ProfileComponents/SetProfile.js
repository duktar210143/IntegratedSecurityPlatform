import React, { useEffect, useState } from "react";
import { UserProfileImage } from "../../Providers/ProfileImageContext";
import "./SetProfile.css"; // Import your CSS file

const SetProfile = () => {
  const { profileImage, setProfileImage } = UserProfileImage();
  const [selectedFile, setSelectedFile] = useState(null);

  async function fetchProfile() {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found");
        return;
      }
      const response = await fetch(
        "https://localhost:5500/api/profile/setProfile",
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        setProfileImage(data.image);
      } else {
        alert(data.error || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleImageChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  useEffect(() => {
    if (selectedFile) {
      fetchProfile();
    }
  }, [selectedFile]);

  return (
    <div className="Edit-btn">
      <label className="file-upload-label" htmlFor="file-upload">
        Change Profile
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleImageChange}
        className="custom-file-input"
      />
    </div>
  );
};

export default SetProfile;