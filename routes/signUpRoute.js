const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signUpController')
// Define the signup route with a unique path
router.post("/signup", signupController.createUser);

router.get("/getAllUsers",signupController.getAllUsers);

module.exports = router;
