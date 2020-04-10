const express = require("express");
const router = express.Router();
const controller = require("../controllers/eng-phrases");

router.get("/phrases", controller.fetchPhrases);

module.exports = router;
