import express from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../../models/index.mjs";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { emailPattern, passwordPattern } from "../../utils/core.mjs";

const router = express.Router();

router.post("/auth/signup", async (req, res, next) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    if (!firstname) {
      return res.status(400).send({
        message: "First Name is Required",
      });
    }
    if (!lastname) {
      return res.status(400).send({
        message: "Last Name is Required",
      });
    }
    if (!password) {
      return res.status(400).send({
        message: "Password is Required",
      });
    }
    if (!email) {
      return res.status(400).send({
        message: "Email is Required",
      });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).send({
        message: "Email is not valid",
      });
    }
    if (!passwordPattern.test(password)) {
      return res.status(400).send({
        message: "Password is not enough Secure",
      });
    }
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).send({
        message: "Email already taken",
      });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await UserModel.create({
      firstname,
      lastname,
      email,
      password: passwordHash,
    });
    return res.send({
      message: "Done",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});
router.post("/auth/login", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
      return res.status(400).send({
        message: "Email is Required",
      });
    }
    if (!password) {
      return res.status(400).send({
        message: "Password is Required",
      });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).send({
        message: "Email is not valid",
      });
    }
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" },
    );
    return res.send({
      message: "Done",
      token: token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      message: "Done",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});
export default router;
