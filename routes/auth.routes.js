const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifySignUp = require("../middleware/verifySignup");

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicatePhoneNumber],
  authController.signUp
);
router.post("/auth/signin", authController.signIn);
module.exports = router;
