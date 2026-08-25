import express from "express";
import { UserModel } from "../../models/index.mjs";
import { authGuard } from "../../middlewares/index.mjs";

const router = express.Router();

// GET PROFILE
router.get("/profile", authGuard, async (req, res) => {
  try {
    return res.status(200).send({
      message: "Profile Fetched",
      data: req.current_user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

// UPDATE PROFILE
router.put("/profile", authGuard, async (req, res) => {
  try {
    const { firstname, lastname, username } = req.body;

    const user = await UserModel.findById(req.current_user._id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (firstname) {
      user.firstname = firstname;
    }

    if (lastname) {
      user.lastname = lastname;
    }

    if (username !== undefined) {
      const trimmedUsername = username?.trim();

      if (!trimmedUsername) {
        return res.status(400).send({
          message: "Username cannot be empty",
        });
      }

      const existingUsername = await UserModel.findOne({
        username: trimmedUsername,
        _id: { $ne: user._id },
      });
      if (existingUsername) {
        return res.status(400).send({
          message: "Username already taken",
        });
      }
      user.username = trimmedUsername;
    }

    await user.save();

    return res.status(200).send({
      message: "Profile Updated",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
