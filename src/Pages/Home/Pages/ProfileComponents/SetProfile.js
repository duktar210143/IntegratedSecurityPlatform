import React, { useEffect, useState } from "react";
import { UserProfileImage } from "../../Providers/ProfileImageContext";
import "./SetProfile.css"; // Import your CSS file

const SetProfile = () => {
  const { profileImage, setProfileImage } = UserProfileImage();

  // send fetch request to post the profile picture
  async function fetchProfile() {
    const formData = new FormData();
    formData.append("file", profileImage);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found");
        return;
      }
      // Post request to upload the image to the database and save temporarily on the server
      const response = await fetch(
        "http://localhost:5500/api/profile/setProfile",
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data)
      console.log("Server Response:", data);
      if (data.status === "ok") {
        console.log("Image saved in the database");

        // Use encodeURIComponent to encode the image path
        setProfileImage(
          data.image
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleImageChange(e) {
    setProfileImage(e.target.files[0]);
  }

  useEffect(() => {
    if (profileImage) {
      // side effect of image fetch request
      fetchProfile();
    }
  }, [profileImage]);

  return (
    <div className="Edit-btn ">
      {/* Custom file input */}
      <label className="file-upload-label" htmlFor="file-upload" >
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
