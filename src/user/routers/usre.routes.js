import { Router } from "express";
import {
  signUp,
  getAllUsers,
  signIn,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  signInValidation,
  signUpValidation,
  updateUserValidation,
} from "../validation/user.validation.js";
const router = Router();

router.route("/").get(getAllUsers).post(signUpValidation, signUp);
router.route("/signin").post(signInValidation, signIn);
router.route("/update").put(updateUserValidation, authentecation, updateUser);
router.route("/delete").delete(authentecation, deleteUser);

export default router;
