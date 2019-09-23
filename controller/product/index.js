const express = require("express");

const router = express.Router();

router.post("/", require("./list"));

module.exports = router;
