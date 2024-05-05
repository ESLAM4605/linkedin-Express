import { Router } from "express";
import {
  getPost,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  getAllCommentsOnPost,
} from "../controllers/posts.controllers.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  createPostValidation,
  updatePostValidation,
} from "../validation/posts.validation.js";
import {
  createCommentValidation,
  deleteCommentValidation,
  updateCommentValidation,
} from "../validation/comments.validation.js";

const router = Router();

router.route("/").post(createPostValidation, authentecation, createPost);
router.route("/:id").get(getPost);
router
  .route("/update/:id")
  .put(updatePostValidation, authentecation, updatePost);
router.route("/delete/:id").delete(authentecation, deletePost);

router
  .route("/:postId/comments")
  .post(createCommentValidation, authentecation, createComment);
router
  .route("/:postId/comments/:commentId")
  .put(updateCommentValidation, authentecation, updateComment)
  .delete(deleteCommentValidation, authentecation, deleteComment);

router
  .route("/:postId/commentsofpost")
  .get(authentecation, getAllCommentsOnPost);

export default router;
