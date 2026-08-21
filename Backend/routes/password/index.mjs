import express from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../../models/index.mjs";

const router = express.Router();

router.put("/password", async (req, res, next) => {
  try {
    const currentPassword = res.body.currentPassword;
    const newPassword = res.body.newPassword;
    const isPassTrue = bcrypt.compare(
      currentPassword,
      req.current_user.password,
    );
    if (!isPassTrue) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }
    const newhash = await bcrypt.hash(newPassword, 12);
    await UserModel.findByIdAndUpdate(req.current_user._id, {
      password: newhash,
    });

    return res.status(200).send({
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});
export default router;
