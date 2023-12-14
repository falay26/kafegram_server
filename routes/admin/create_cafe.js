const express = require("express");
const router = express.Router();
const cafeController = require("../../controllers/cafeController");

router.post("/", cafeController.createCafe);

module.exports = router;
