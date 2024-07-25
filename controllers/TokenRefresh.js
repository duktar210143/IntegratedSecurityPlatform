// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/User.model");

// router.post("/refresh-token", async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Token not provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User doesn't exist" });
//     }

//     const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, { expiresIn: "1h" });

//     return res.json({ success: true, token: newAccessToken });
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return res.status(403).json({ success: false, message: "Invalid or expired token" });
//   }
// });

// module.exports = router;
