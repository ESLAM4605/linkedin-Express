import { Router } from "express";
import {
  createReactOnPost,
  deletePostReact,
  getLastUserReactActivity,
  getPostReactions,
} from "../controller/react.controller.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  createPostReactValidation,
  getOrDeleteReactsValidation,
} from "../validation/react.validation.js";
const router = Router();

router.get(
  "/posts/:postId/reactions",
  getOrDeleteReactsValidation,
  getPostReactions
);

router.get("/profile/reactions", authentecation, getLastUserReactActivity);
router.post(
  "/posts/:postId/reactions",
  createPostReactValidation,
  authentecation,
  createReactOnPost
);
router.delete(
  "/posts/:postId/reactions",
  getOrDeleteReactsValidation,
  authentecation,
  deletePostReact
);

export default router;
