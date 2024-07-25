// const User = require("../models/User.model");
// const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary");
// const profileController = async (req, res) => {
//   console.log("profile test1");
//   try {
//     const file = req.files.file;
//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const token = req.headers["x-access-token"];
//     if (!token) {
//       return res.status(401).json({ error: "Token not provided" });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
//       console.log(decoded);
//       const username = decoded.username;

//       const user = await User.findOne({ username: username });

//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       const uploadedImage = await cloudinary.v2.uploader.upload(
//         file.path,
//         {
//           folder: "UserProfile",
//           crop: "scale",
//         }
//       );

//       if (!uploadedImage.secure_url) {
//         return res.status(500).json({ error: "Image upload failed" });
//       }

//       user.image = uploadedImage.secure_url;
//       const userData = await user.save();
//       return res.json({ success: true, profile: user.image, user: userData });
//     } catch (error) {
//       console.error("Token Verification Error:", error);
//       return res.status(401).json({ message: "Token verification failed" });
//     }
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };


// const getProfileController = async (req, res) => {
//   try {
//     const token = req.headers["x-access-token"];
//     if (!token) {
//       return res.status(401).json({ message: "Token not provided", status: false });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
//       const username = decoded.username;
//       const user = await User.findOne({ username: username });

//       if (!user) {
//         return res.status(404).json({ message: "User not found", status: false });
//       }

//       return res.json({
//         status: true,
//         image: user.image,
//         user: user,
//         message: "Profile retrieved successfully",
//       });
//     } catch (error) {
//       console.error("Token Verification Error:", error);
//       return res.status(401).json({ error: "Unauthorized", status: false });
//     }
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res.status(500).json({ error: "Server error", status: false });
//   }
// };


// module.exports = {
//   profileController,
//   getProfileController,
// };


const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const profileController = async (req, res) => {
  try {
    const file = req.files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "UserProfile",
      crop: "scale",
    });

    if (!uploadedImage.secure_url) {
      return res.status(500).json({ error: "Image upload failed" });
    }

    user.image = uploadedImage.secure_url;
    const userData = await user.save();
    return res.json({ success: true, image: user.image, user: userData });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getProfileController = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({ message: "Token not provided", status: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const username = decoded.username;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    return res.json({
      status: true,
      image: user.image,
      user: user,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Server error", status: false });
  }
};

module.exports = {
  profileController,
  getProfileController,
};