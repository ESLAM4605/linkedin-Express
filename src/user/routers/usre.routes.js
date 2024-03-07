import { Router } from "express";
import { signUp, getAllUsers, signIn } from "../controllers/user.controller.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
const router = Router();

router.route("/").get(getAllUsers).post(signUp);
router.route("/signin").post(signIn);

export default router;
