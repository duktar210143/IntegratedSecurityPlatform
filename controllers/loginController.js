// const User = require("../models/User.model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const loginUser = async (req, res) => {
//   console.log(req.body);
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username: username });

//     if (user) {
//       const passwordMatch = await bcrypt.compare(password, user.password);


//       if (passwordMatch) {
//         // Check password expiry
//         const passwordAge = Date.now() - new Date(user.passwordCreated).getTime();
//         const ninetyDaysInMilliseconds = 90 * 24 * 60 * 60 * 1000;
        

//         if (passwordAge > ninetyDaysInMilliseconds) {
//           return res.status(403).json({ message: "Password expired. Please change your password." });
//         }
//         const token = jwt.sign({ username: user.username }, process.env.JWT_TOKEN_SECRET);
//         req.session.user = { username }
//         return res.json({
//           success: true,
//           message: "Logged in successfully",
//           token: token,
//           userData: user,
//         });
//       } else {
//         return res.json({ success: false, message: "Invalid password" });
//       }
//     } else {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// // module.exports = { loginUser };
// // const User = require("../models/User.model");
// // const bcrypt = require("bcrypt");
// // const jwt = require("jsonwebtoken");

// // const MAX_LOGIN_ATTEMPTS = 3;
// // const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

// // // const loginUser = async (req, res) => {
// // //   const { username, password } = req.body;

// // //   if (!req.session.loginAttempts) {
// // //     req.session.loginAttempts = 0;
// // //   }

// // //   if (!req.session.lastLoginAttempt) {
// // //     req.session.lastLoginAttempt = Date.now();
// // //   }

// // //   const currentTime = Date.now();

// // //   if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS && currentTime - req.session.lastLoginAttempt < LOCK_TIME) {
// // //     return res.status(403).json({ message: "Maximum login attempts exceeded. Please try again later." });
// // //   }

// // //   try {
// // //     const user = await User.findOne({ username });

// // //     if (!user) {
// // //       req.session.loginAttempts += 1;
// // //       req.session.lastLoginAttempt = currentTime;
// // //       return res.status(400).json({ message: "Invalid username or password" });
// // //     }

// // //     const isMatch = await bcrypt.compare(password, user.password);

// // //     if (!isMatch) {
// // //       req.session.loginAttempts += 1;
// // //       req.session.lastLoginAttempt = currentTime;
// // //       return res.status(400).json({ message: "Invalid username or password" });
// // //     }

// // //     // Reset login attempts on successful login
// // //     req.session.loginAttempts = 0;
// // //     req.session.lastLoginAttempt = currentTime;

// // //     const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, { expiresIn: "1h" });

// // //     res.status(200).json({ success: true, message: "Login successful", token, user });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ message: "Internal server error" });
// // //   }
// // // };

// // // module.exports = { loginUser };


// // const loginUser = async (req, res) => {
// //   const { username, password } = req.body;

// //   if (!req.session.loginAttempts) {
// //     req.session.loginAttempts = 0;
// //   }

// //   if (!req.session.lastLoginAttempt) {
// //     req.session.lastLoginAttempt = Date.now();
// //   }

// //   const currentTime = Date.now();

// //   if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS && currentTime - req.session.lastLoginAttempt < LOCK_TIME) {
// //     return res.status(403).json({ message: "Maximum login attempts exceeded. Please try again later." });
// //   }

// //   try {
// //     const user = await User.findOne({ username });

// //     if (!user) {
// //       req.session.loginAttempts += 1;
// //       req.session.lastLoginAttempt = currentTime;
// //       return res.status(400).json({ message: "Invalid username or password" });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);

// //     if (!isMatch) {
// //       req.session.loginAttempts += 1;
// //       req.session.lastLoginAttempt = currentTime;
// //       return res.status(400).json({ message: "Invalid username or password" });
// //     }

// //     // Reset login attempts on successful login
// //     req.session.loginAttempts = 0;
// //     req.session.lastLoginAttempt = currentTime;

// //     const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET);

// //     res.status(200).json({ success: true, message: "Login successful", token, user });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// // module.exports = { loginUser };


const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes
const NINETY_DAYS_IN_MILLISECONDS = 90 * 24 * 60 * 60 * 1000;

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Initialize session variables if not present
  if (!req.session.loginAttempts) {
    req.session.loginAttempts = 0;
  }

  if (!req.session.lastLoginAttempt) {
    req.session.lastLoginAttempt = Date.now();
  }

  const currentTime = Date.now();

  // Check if the user is locked out due to too many failed login attempts
  if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS && currentTime - req.session.lastLoginAttempt < LOCK_TIME) {
    return res.status(403).json({ message: "Maximum login attempts exceeded. Please try again later." });
  }

  try {
    const user = await User.findOne({ username: username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Check password expiry
        const passwordAge = Date.now() - new Date(user.passwordCreated).getTime();
        if (passwordAge > NINETY_DAYS_IN_MILLISECONDS) {
          return res.status(403).json({ message: "Password expired. Please change your password." });
        }

        // Reset login attempts on successful login
        req.session.loginAttempts = 0;
        req.session.lastLoginAttempt = currentTime;

        try {
          const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_TOKEN_SECRET
          );
          req.session.user = { username, role: user.role };
          return res.json({
            success: true,
            message: "Logged in successfully",
            token: token,
            userData: user,
          });
        } catch (jwtError) {
          console.error("JWT Token Error:", jwtError);
          return res.status(500).json({ success: false, message: "Token generation error" });
        }
      } else {
        req.session.loginAttempts += 1;
        req.session.lastLoginAttempt = currentTime;
        return res.json({ success: false, message: "Invalid password" });
      }
    } else {
      req.session.loginAttempts += 1;
      req.session.lastLoginAttempt = currentTime;
      return res.status(401).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginUser };
