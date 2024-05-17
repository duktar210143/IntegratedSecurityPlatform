import React, { useState, useEffect } from "react";
import { UserProfileImage } from "../../Providers/ProfileImageContext";
import "./GetProfile.css";

const GetProfile = () => {
  const { profileImage, setProfileImage } = UserProfileImage();
  const [loading, setLoading] = useState(true);

  // Fetch profile from the server
  async function getProfile() {
    console.log("getProfile")
    try {
      const token = localStorage.getItem("token");

      const req = await fetch("http://localhost:5500/api/profile/getprofile", {
        method: "GET",
        headers: {
          "x-access-token": token,
        },
      });

      const data = await req.json();
      console.log(data)
      if (data.status === true) {
        setLoading(false);
        const imageUrl = data.image;
        setProfileImage(imageUrl);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching the profile:", error);
      alert(
        "An error occurred while fetching the profile. Please check the console for details."
      );
    }
  }

  // Execute the getProfile function when the component mounts
  useEffect(() => {
    getProfile();
  }, [profileImage]); // An empty dependency array ensures this effect runs only once

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
       <div className="profileimg">
         <img
          src={profileImage}
          alt="User Profile"
        />
       </div>
      )}
    </div>
  );
};

export default GetProfile;
