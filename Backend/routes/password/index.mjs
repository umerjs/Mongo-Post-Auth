import express from "express";

const router = express.Router();

router.put("/password", (req, res, next) => {
  res.send({
    message: "Password Changed",
  });
});
export default router;
