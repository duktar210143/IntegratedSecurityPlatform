const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");

// Encryption key - store this securely, preferably in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "YourSecretKeyForEncryption";

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const checkPasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 16;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#^]/.test(password);
  const isValidLength = password.length >= minLength && password.length <= maxLength;

  if (!isValidLength) {
    return { success: false, message: `Password must be between ${minLength} and ${maxLength} characters.` };
  }
  if (!hasUpperCase) {
    return { success: false, message: "Password must include at least one uppercase letter." };
  }
  if (!hasNumber) {
    return { success: false, message: "Password must include at least one number." };
  }
  if (!hasSpecialChar) {
    return { success: false, message: "Password must include at least one special character (@$!%*?&#^)." };
  }
  return { success: true, message: "Password is strong." };
};

const createUser = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;

  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({ message: "Please enter all fields.", success: false });
  }

  const passwordStrength = checkPasswordStrength(password);
  if (!passwordStrength.success) {
    return res.status(400).json({ message: passwordStrength.message, success: false });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname: encrypt(firstname),
      lastname: encrypt(lastname),
      email: encrypt(email),
      username:encrypt(username),
      password: hashedPassword,
      previousPasswords: [hashedPassword],
      passwordCreated: Date.now(),
    });

    const result = await newUser.save();

    // Decrypt sensitive information before sending response
    const userResponse = {
      ...result.toObject(),
      firstname: decrypt(result.firstname),
      lastname: decrypt(result.lastname),
      email: decrypt(result.email),
      password: undefined, // Remove password from response
    };

    return res.status(201).json({
      success: true,
      status: "ok",
      message: "User Created",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit set to 10
    const skip = (page - 1) * limit;

    const users = await User.find({}, { password: 0 })
      .skip(skip)
      .limit(limit);

    // Decrypt sensitive information
    const decryptedUsers = users.map(user => ({
      ...user.toObject(),
      firstname: decrypt(user.firstname),
      lastname: decrypt(user.lastname),
      email: decrypt(user.email),
    }));

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      success: true,
      status: "ok",
      users: decryptedUsers,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers: totalUsers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// You might want to add a function to get a single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Decrypt sensitive information
    const decryptedUser = {
      ...user.toObject(),
      firstname: decrypt(user.firstname),
      lastname: decrypt(user.lastname),
      email: decrypt(user.email),
    };

    return res.status(200).json({
      success: true,
      user: decryptedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// You might also want to add an update user function
const updateUser = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const updatedFields = {};

    if (firstname) updatedFields.firstname = encrypt(firstname);
    if (lastname) updatedFields.lastname = encrypt(lastname);
    if (email) updatedFields.email = encrypt(email);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Decrypt sensitive information
    const decryptedUser = {
      ...user.toObject(),
      firstname: decrypt(user.firstname),
      lastname: decrypt(user.lastname),
      email: decrypt(user.email),
    };

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: decryptedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
};
