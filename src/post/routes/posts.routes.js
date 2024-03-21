import { Router } from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getAllComments,
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

router
  .route("/")
  .get(getAllPosts)
  .post(createPostValidation, authentecation, createPost);
router.route("/:id").get(getPost);
router
  .route("/update/:id")
  .put(updatePostValidation, authentecation, updatePost);
router.route("/delete/:id").delete(authentecation, deletePost);

router.route("/comments").get(getAllComments);
router
  .route("/comments/:id")
  .post(createCommentValidation, authentecation, createComment)
  .put(updateCommentValidation, authentecation, updateComment)
  .delete(deleteCommentValidation, authentecation, deleteComment);

router.route("/commentsofpost/:id").get(authentecation, getAllCommentsOnPost);

export default router;
