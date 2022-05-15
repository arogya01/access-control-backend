const express = require("express");
const router = express.Router();
const dbConnect = require("../database/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const filesControllers = require("../controllers/files");
const ensureLogin = require("../middleware/ensureLogin");
require("dotenv").config();

const { getAllFiles } = filesControllers;

router.get("/files", ensureLogin, (req, res) => {
  getAllFiles(res);
});

module.exports = router;
