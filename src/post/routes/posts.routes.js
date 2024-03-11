import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";
import { authorized, authentecation } from "../../user/auth/auth.js";

const router = Router();

router.route("/").get(getAllPosts).post(authentecation, createPost);
router.route("/update/:id").put(authentecation, updatePost);
router.route("/delete/:id").delete(authentecation, deletePost);

export default router;
