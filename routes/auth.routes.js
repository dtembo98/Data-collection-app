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
router.post("/auth/access-token", authController.token);
router.post("/auth/logout", authController.logOut);

module.exports = router;
