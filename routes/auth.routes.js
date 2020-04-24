const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifySignUp = require("../middleware/verifySignup");
const { verifyToken, verifyRefreshToken } = require("../middleware/auth.jwt");

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicatePhoneNumber],
  authController.signUp
);
router.post("/auth/signin", authController.signIn);
router.post("/auth/access-token", [verifyRefreshToken], authController.token);
router.get("/auth/logout", [verifyToken], authController.logOut);

module.exports = router;
