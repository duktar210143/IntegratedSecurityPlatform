import React, { createContext, useContext, useState } from "react";

const ProfileImageContext = createContext();

export function UserProfileImage(){
    return useContext(ProfileImageContext);
}

export function ProfileImageProvider({children}){
    const [profileImage,setProfileImage] = useState([]);

    return (
        <ProfileImageContext.Provider value={{profileImage,setProfileImage}}>
            {children}
        </ProfileImageContext.Provider>
    )
} 

export default ProfileImageContext;