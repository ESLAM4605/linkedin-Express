import { Router } from "express";
import {
  signUp,
  signIn,
  updateUser,
  deleteUser,
  changePassword,
  searchForOneUser,
  getProfileInfo,
  createlanguage,
  updateLanguage,
  deleteLanguage,
  getUserPosts,
  createFriendship,
  getFriendships,
  rejectRequest,
  acceptRequest,
  deleteFriendship,
  listOfFriends,
  listOfPendingRecivedRequestes,
  listOfPendingSentRequestes,
  getListOfFriends,
  verfyEmail,
  resetPassword,
  forgetPassword,
  getAllPostsOfFriends,
  refreshToken,
} from "../controllers/user.controller.js";
import { authorized, authentecation } from "../../user/auth/auth.js";
import {
  signInValidation,
  signUpValidation,
  updateUserValidation,
  changingPasswordVali,
} from "../validation/user.validation.js";
import { uploadMiddleware } from "../../middlewares/uoploadpic.middleware.js";
import {
  acceptRequestValidation,
  createFriendshipValidation,
  rejectRequestValidation,
} from "../validation/friendship.validation.js";

const router = Router();
router.route("/").post(uploadMiddleware, signUpValidation, signUp);

router.route("/profile").get(authentecation, getProfileInfo);
router.route("/userposts").get(getUserPosts);
router.get("/search", searchForOneUser);
router
  .route("/update/password")
  .put(authentecation, changingPasswordVali, changePassword);
router.route("/signin").post(signInValidation, signIn);
router.route("/update").put(updateUserValidation, authentecation, updateUser);

router.route("/delete").delete(authentecation, deleteUser);

router.route("/:userId/languages").post(authentecation, createlanguage);
router
  .route("/:userId/languages/:id")
  .put(authentecation, updateLanguage)
  .delete(authentecation, deleteLanguage);

router.route("/addfriend").get(authentecation, getFriendships);
router
  .route("/addfriend/:user2Id")
  .post(createFriendshipValidation, authentecation, createFriendship);
router
  .route("/updatefriendship/reject/:id")
  .put(rejectRequestValidation, authentecation, rejectRequest);
router
  .route("/updatefriendship/accept/:id")
  .put(acceptRequestValidation, authentecation, acceptRequest);
router.route("/friendship/delete/:id").delete(authentecation, deleteFriendship);
router.route("/friendslist").get(authentecation, listOfFriends);
router
  .route("/pendingrecivedrequestes")
  .get(authentecation, listOfPendingRecivedRequestes);
router
  .route("/pendingsentrequestes")
  .get(authentecation, listOfPendingSentRequestes);

router.route("/list-of-friends").get(authentecation, getListOfFriends);
router.get("/verify/:token", verfyEmail);
router.post("/reset", forgetPassword);
router.get("/reset/:token", resetPassword);

router.route("/posts-of-friends").get(authentecation, getAllPostsOfFriends);

router.route("/refresh-token").post(refreshToken);

export default router;
