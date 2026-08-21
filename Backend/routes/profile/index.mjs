import express from "express";
import { UserModel } from "../../models/index.mjs";

const router = express.Router();

router.get("/profile", async (req, res, next) => {
  try {
    return res.send({
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
router.put("/profile", async (req, res, next) => {
  try {
    const firstname = re.body.firstname;
    const lastname = re.body.lastname;
    const user = await UserModel.findByIdAndUpdate({
      _id: req.current_user._id,
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    if (firstname) {
      current_user = firstname;
    }
    if (lastname) {
      current_user = lastname;
    }
    await current_user.save();
    return res.send({
      message: "Profile Updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
