// UserProfileImageContext.js
import React, { createContext, useContext, useState } from "react";

const UserProfileImageContext = createContext();

export const UserProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <UserProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </UserProfileImageContext.Provider>
  );
};

export const UserProfileImage = () => useContext(UserProfileImageContext);