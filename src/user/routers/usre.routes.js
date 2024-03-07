import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(getAllUsers).post(createUser);

export default router;
