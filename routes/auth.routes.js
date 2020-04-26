const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifySignUp = require("../middleware/verifySignup");
const { verifyToken, verifyRefreshToken } = require("../middleware/auth.jwt");
const SchemaValidator = require("../middleware/schemaValidator");
const validateRequest = SchemaValidator(true);
router.post(
  "/auth/signup",
  [validateRequest, verifySignUp.checkDuplicatePhoneNumber],
  authController.signUp
);
router.post("/auth/signin", [validateRequest], authController.signIn);
router.post("/auth/access-token", [verifyRefreshToken], authController.token);
router.get("/auth/logout", [verifyToken], authController.logOut);
router.post(
  "/auth/delete-account",
  [verifyToken],
  authController.deleteAccount
);

module.exports = router;
