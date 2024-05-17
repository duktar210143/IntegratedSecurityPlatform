const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const {firstname,lastname,email,username,password} = req.body

   if(!firstname || !lastname || !email ||!username || !password){
    return res.status(400).json({message:"Please enter all fields.",success:false},);
}
  try {
    const existingUser = await User.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname:firstname,
      lastname:lastname,
      email:email,
      username: username,
      password: hashedPassword,
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
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Get page and limit from query parameters or use default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ; // Adjust the default limit as needed

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
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


module.exports = {
  createUser,
  getAllUsers,
};
