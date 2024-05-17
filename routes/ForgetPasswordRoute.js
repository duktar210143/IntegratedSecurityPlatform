const express = require("express");
const router = express.Router();
const ForgotPasswordController = require("../controllers/ForgotPasswordController");

router.post(
  "/forgot_password",
  ForgotPasswordController.ForgotPasswordController
);
router.get(
  "/reset-password/:id/:token",
  ForgotPasswordController.checkResetLink
);
router.post("/reset-password/:id/:token",
ForgotPasswordController.resetpassword
);
module.exports = router;
