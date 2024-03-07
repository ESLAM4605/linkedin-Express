import { Router } from "express";
import { signup, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(getAllUsers).post(signup);

export default router;
