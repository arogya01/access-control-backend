require("dotenv").config();
const userController = require("../controllers/users");
const express = require("express");
const app = express();
app.use(express.json());

// this middleware will run through to ensure that the user who is accessing this route is authorized to do so
const jwt = require("jsonwebtoken");

module.exports = function ensureLogin(req, res, next) {
  const jwt_token = req.header("Authorization");
  console.log(jwt_token);
  jwt.verify(jwt_token, process.env.SECRET_KEY_ACCESS, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { email } = payload;

    const result = userController.findUser({ email: email });
    req.user = { result };
    next();
  });
};
