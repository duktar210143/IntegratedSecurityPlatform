const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  console.log(req.body);
  const {username, password} = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ username: user.username }, process.env.JWT_TOKEN_SECRET);
        
        return res.json({
          success: true,
          message: "Logged in successfully",
          token: token,
          userData: user,
        });
      } else {
        return res.json({ success: false, message: "Invalid password" });
      }
    } else {
      return res.status(401).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { loginUser };
