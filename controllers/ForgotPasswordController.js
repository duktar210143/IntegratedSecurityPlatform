const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const ForgotPasswordController = async (req, res) => {
  // destructuring email from request body

  const { email } = req.body;

  //   validating email
  if (!email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    // check existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn not exist" });
    }

    // create a token
    const secret = process.env.JWT_TOKEN_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    // create a link
    const link = `http://localhost:5500/api/user/reset-password/${user._id}/${token}`;

    //sending link to email through transporter
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duktar13@gmail.com",
        pass: "fvyb vyon ykak qlgh",
      },
    });
    console.log(link);

    var mailOptions = {
      from: "duktar13@gmail.com",
      to: email,
      subject: "password reset link",
      text: link,
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent ", info.response);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const checkResetLink = async (req, res) => {
  const { id, token } = req.params;
  // if id or token isn't provided
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(400).json({ msg: "please provide your id" });
  }

  // verify token
  const secret = process.env.JWT_TOKEN_SECRET + oldUser.password;
  try {
    // verify token
    const verify = jwt.verify(token, secret);
    // if verified true
    res.render("index", { email: verify.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "password reset link not verified",
    });
  }
};

const resetpassword = async (req, res) => {
  // get id and token from params
  const { id, token } = req.params;
  // get the password from body
  const { password } = req.body;

  // find user
  const oldUser = await User.findOne({ _id: id });
  // if user doesn;t exist
  if (!oldUser) {
    return res.status(400).json({ msg: "user does not exist" });
  }

  // create a secret
  const secret = process.env.JWT_TOKEN_SECRET + oldUser.password;
  try {
    jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    return res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

module.exports = { ForgotPasswordController, checkResetLink, resetpassword };
