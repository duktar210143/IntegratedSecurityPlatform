const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const ForgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const secret = process.env.JWT_TOKEN_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "15m" });
    const link = `https://localhost:5500/api/user/reset-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duktar13@gmail.com",
        pass: "fvyb vyon ykak qlgh",
      },
    });
    console.log(link);

    const mailOptions = {
      from: "duktar13@gmail.com",
      to: email,
      subject: "Password reset link",
      text: link,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent", info.response);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkResetLink = async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(400).json({ msg: "Please provide your id" });
  }

  const secret = process.env.JWT_TOKEN_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password reset link not verified",
    });
  }
};

const resetpassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  const secret = process.env.JWT_TOKEN_SECRET + oldUser.password;
  try {
    jwt.verify(token, secret);

    // Check if the new password matches any of the previous passwords
    for (const oldPassword of oldUser.previousPasswords) {
      const isMatch = await bcrypt.compare(password, oldPassword);
      if (isMatch) {
        return res.status(400).json({ success: false, message: "You cannot reuse an old password." });
      }
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and add the old password to previous passwords
    oldUser.previousPasswords.push(oldUser.password);
    oldUser.password = encryptedPassword;
    oldUser.passwordCreated = new Date();

    const result = await oldUser.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

module.exports = { ForgotPasswordController, checkResetLink, resetpassword };
