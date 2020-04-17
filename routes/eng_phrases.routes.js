const express = require("express");
const router = express.Router();
const controller = require("../controllers/eng-phrases");
const { verifyToken } = require("../middleware/auth.jwt");

router.get("/all-phrases", controller.fetchAllPhrases);
router.get("/phrases", [verifyToken], controller.fetchPhrases);
router.post(
  "/translate/phrase",
  [verifyToken],
  controller.postTranslatedPhrases
);
module.exports = router;
