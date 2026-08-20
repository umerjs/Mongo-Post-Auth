import express from "express";
import { PostModel } from "../../models/index.mjs";
import { isValidObjectId } from "mongoose";

const router = express.Router();

router.post("/post", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({ error: "Title is Required" });
    }

    if (!req.body.description) {
      return res.status(400).send({ error: "Description is Required" });
    }

    await PostModel.create({
      title: req.body.title,
      description: req.body.description,
    });

    return res.status(201).send({
      message: "Post Created",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

router.get("/post", async (req, res) => {
  try {
    const allPosts = await PostModel.find();

    return res.send({
      message: "Posts Found",
      data: allPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

router.get("/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    // Validate ID before querying MongoDB
    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        error: "Invalid Id",
      });
    }

    const singlePost = await PostModel.findById(postId);

    if (!singlePost) {
      return res.status(404).send({
        message: "Post Not Found",
      });
    }

    return res.send({
      message: "Post Found",
      data: singlePost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});
router.delete("/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    // Validate ID before querying MongoDB
    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        error: "Invalid Id",
      });
    }

    await PostModel.findByIdAndDelete(postId);

    return res.send({
      message: "Post Deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});
router.put("/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!isValidObjectId(postId)) {
      return res.status(400).send({
        error: "Invalid Id",
      });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      $set: {
        title: req.body.title,
        description: req.body.description,
      },
    });

    if (!updatedPost) {
      return res.status(404).send({
        message: "Post Not Found",
      });
    }

    return res.send({
      message: "Post Updated",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
});
export default router;
