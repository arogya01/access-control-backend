const express = require("express");
const router = express.Router();
const dbConnect = require("../database/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userControllers = require("../controllers/users");
const ensureLogin = require("../middleware/ensureLogin");
require("dotenv").config();
const { client } = dbConnect;

const { createUser, findUser, generateAccessToken, generateRefreshToken } =
  userControllers;

let refreshTokens = [];

router.get("/profile", ensureLogin, async (req, res) => {
  const email = req.body.email;

  const userInfo = await userControllers.findUser({ email: email });

  if (userInfo) {
    res.status(200).send(userInfo);
  } else {
    res.status(403).json({ message: "invalid email" });
  }
});

router.post("/profile", async (req, res) => {
  const email = req.body.email;
  const criminalRecord = req.body.criminalRecord;
  const age = req.body.age;

  const userInfo = await userControllers.findUser({ email: email });

  if (userInfo.criminalRecord === undefined && userInfo.age === undefined) {
    const updatedUserInfo = await client
      .db("access")
      .collection("users")
      .updateOne(
        { email: email },
        { $set: { criminalRecord: criminalRecord, age: age } }
      );

    res.status(200).json({
      name: userInfo.name,
      email: userInfo.email,
      criminalRecord: userInfo.criminalRecord,
      age: userInfo.age,
    });
  } else {
    res.status(200).json({
      name: userInfo.name,
      email: userInfo.email,
      criminalRecord: userInfo.criminalRecord,
      age: userInfo.age,
    });
  }
});

router.post("/signup", async (req, res) => {
  const saltRounds = 10;

  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, saltRounds);
  const name = req.body.name;
  const isAdmin = false;

  // console.log(password);

  await createUser(
    {
      email: email,
      name: name,
      password: password,
      isAdmin: isAdmin,
      layer1: "",
      layer2: "",
      layer3: "",
    },
    res
  );
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.dir(email, password);
  if (!email || !password) {
    res.status(422).send({ error: "please add email or password" });
    res.end();
  }

  const userInfo = await userControllers.findUser({ email: email });

  if (userInfo) {
    const match = await bcrypt.compare(req.body.password, userInfo.password);
    if (match) {
      const accessToken = generateAccessToken({ user: req.body.name });
      const refreshToken = generateRefreshToken({ user: req.body.name });

      res.json({
        name: userInfo.name,
        email: userInfo.email,
        criminalRecord: userInfo.criminalRecord
          ? userInfo.criminalRecord
          : null,
        age: userInfo.age ? userInfo.age : null,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(400).send(new Error("incorrect password!!"));
    }
  } else res.status(404).json({ error: "user not found" });
});

router.post("/refreshToken", (req, res) => {
  if (!refreshTokens.includes(req.body.token)) {
    res.status(400).send("refresh token invalid");
  }

  refreshTokens = refreshTokens.filter((c) => {
    c !== req.body.token;
  });

  const accessToken = generateAccessToken({ user: req.body.name });
  const refreshToken = generateRefreshToken({ user: req.body.name });

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((c) => {
    c !== req.body.token;
  });

  res.status(203).send("Logged Out !!! ");
});

module.exports = router;
