import { Router } from "express";
import { getAllPosts, getPost } from "../controllers/posts.controllers.js";

const router = Router();

router.route("/").get(getAllPosts);

export default router;
