const User = require("../models/User.model");
const bcrypt = require("bcrypt");

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
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      previousPasswords: [hashedPassword],
      passwordCreated: Date.now(),
    });

    const result = await newUser.save();
    console.log(result);

    return res.status(201).json({
      success: true,
      status: "ok",
      message: "User Created",
      user: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getAllUsers = async (req, res) => {
  try {
    // Get page and limit from query parameters or use default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit); // Adjust the default limit as needed

    // Calculate the skip value based on page and limit
    const skip = (page - 1) * limit;

    // Fetch users with pagination from the database
    const users = await User.find({}, { password: 0 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      status: "ok",
      users: users,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(users.length / limit),
        totalUsers: users.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
