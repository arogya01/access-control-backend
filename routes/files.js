const express = require("express");
const router = express.Router();
const dbConnect = require("../database/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const filesControllers = require("../controllers/files");
const ensureLogin = require("../middleware/ensureLogin");
require("dotenv").config();
const userController = require("../controllers/users");
const { client } = dbConnect;

const { getAllFiles } = filesControllers;

router.get("/layer-1", ensureLogin, async (req, res) => {
  const role = req.body.role;
  const exp = req.body.exp;
  const treated = req.body.treated;
  const email = req.body.email;

  const user = await userController.findUser({ email: email });
  if (user.layer1) {
    res.status(200).json({ score: user.layer1 });
  } else {
    const result = Math.floor(Math.random() * 11);
    const score = await client
      .db("access")
      .collection("users")
      .updateOne({ email: email }, { $set: { layer1: result } });

    console.log(user);
    res.status(200).json({ score: result });
  }
});

router.get("/layer-2", ensureLogin, async (req, res) => {
  const email = req.body.email;

  const user = await userController.findUser({ email: email });
  if (user.layer2) {
    res.status(200).json({ score: user.layer2 });
  } else {
    const result = Math.floor(Math.random() * 11);
    const score = await client
      .db("access")
      .collection("users")
      .updateOne({ email: email }, { $set: { layer2: result } });

    console.log(user);
    res.status(200).json({ score: result });
  }
});

router.get("/layer-3", ensureLogin, async (req, res) => {
  const role = req.body.role;
  const exp = req.body.exp;
  const treated = req.body.treated;
  const email = req.body.email;

  const user = await userController.findUser({ email: email });
  console.log(user);
  console.log("layer 3 val is ");
  console.log(user.layer3);

  if (user.layer3) {
    res.status(200).json({ score: user.layer3 });
  } else {
    const result = Math.floor(Math.random() * 11);
    const score = await client
      .db("access")
      .collection("users")
      .updateOne({ email: email }, { $set: { layer3: result } });

    console.log(user);
    res.status(200).json({ score: result });
  }
});

module.exports = router;
