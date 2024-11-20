import express from "express";
import {
  getPosts,
  getPost,
  addPost,
  deletePost,
  updatePost,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/post.js";

const router = express.Router();

// Posts routes
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

// Comments routes
router.post("/:postId/comments", addComment);
router.get("/:postId/comments", getComments);
router.delete("/:postId/comments/:commentId", deleteComment);

export default router;
