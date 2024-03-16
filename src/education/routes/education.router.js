import { Router } from "express";
import {
  getAllEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller.js";
import { authentecation, authorized } from "../../user/auth/auth.js";
import {
  createEducationVali,
  updateEducationVali,
  deleteEducationValidation,
} from "../validation/education.validation.js";
const router = Router();
router
  .route("/")
  .get(getAllEducations)
  .post(createEducationVali, authentecation, createEducation);
router
  .route("/:id")
  .put(updateEducationVali, authentecation, updateEducation)
  .delete(deleteEducationValidation, authentecation, deleteEducation);
export default router;
