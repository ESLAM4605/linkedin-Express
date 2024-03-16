import { Router } from "express";
import {
  signUp,
  getAllUsers,
  signIn,
  updateUser,
  deleteUser,
  changePassword,
  searchForOneUser,
  getProfileInfo,
  disebleUser,
  activeUser,
} from "../controllers/user.controller.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  signInValidation,
  signUpValidation,
  updateUserValidation,
  changingPasswordVali,
  updateInActiveValidation,
} from "../validation/user.validation.js";
import { uploadMiddleware } from "../../middlewares/uoploadpic.middleware.js";
const router = Router();
router
  .route("/")
  .get(getAllUsers)
  .post(uploadMiddleware, signUpValidation, signUp);
router.route("/profile").get(getProfileInfo);
router.get("/search", searchForOneUser);
router
  .route("/update/password")
  .put(authentecation, changingPasswordVali, changePassword);
router.route("/signin").post(signInValidation, signIn);
router.route("/update").put(updateUserValidation, authentecation, updateUser);
router
  .route("/inactive")
  .put(updateInActiveValidation, authentecation, disebleUser);
router
  .route("/active")
  .put(updateInActiveValidation, authentecation, activeUser);
router.route("/delete").delete(authentecation, deleteUser);

export default router;
