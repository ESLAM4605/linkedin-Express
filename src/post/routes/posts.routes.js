import { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.controllers.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  createPostValidation,
  updatePostValidation,
} from "../validation/posts.validation.js";

const router = Router();

router
  .route("/")
  .get(getAllPosts)
  .post(createPostValidation, authentecation, createPost);
router.route("/:id").get(getPost);
router
  .route("/update/:id")
  .put(updatePostValidation, authentecation, updatePost);
router.route("/delete/:id").delete(authentecation, deletePost);

export default router;
