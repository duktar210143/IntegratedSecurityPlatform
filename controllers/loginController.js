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
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
          );

          // Verify the token immediately after creation
          jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
            if (err) {
              console.error("JWT Verification Error:", err);
              return res.status(500).json({ success: false, message: "Token verification failed" });
            }

            // If verification is successful, proceed with the login response
            req.session.user = { username, role: user.role };
            return res.json({
              success: true,
              message: "Logged in successfully",
              token: token,
              userData: user,
            });
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