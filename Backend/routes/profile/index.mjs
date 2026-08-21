import express from "express";

const router = express.Router();

router.get("/profile", (req, res, next) => {
  res.send({
    message:"Profile Fetched"
  })
});
router.put("/profile", (req, res, next) => {
  res.send({
    message:"Profile Updated"
  })
});

export default router;
