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
  createlanguage,
  getAllLanguages,
  updateLanguage,
  deleteLanguage,
  getUserPosts,
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
router.route("/userposts").get(getUserPosts);
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

router.route("/languages").get(getAllLanguages);
router.route("/languages").post(authentecation, createlanguage);
router
  .route("/languages/:id")
  .put(authentecation, updateLanguage)
  .delete(authentecation, deleteLanguage);

export default router;
