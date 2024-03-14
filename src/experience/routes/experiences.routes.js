import { Router } from "express";

import {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
} from "../controllers/experiences.controllers.js";
import { authentecation, authorized } from "../../user/auth/auth.js";

import {
  createExperienceValidation,
  deleteExperienceValidation,
  updateExperienceValidation,
} from "../../experience/validation/experience.nalidation.js";

const router = Router();

router.route("/").get(getAllExperiences).post(
  // createExperienceValidation,
  authentecation,
  createExperience
);
router
  .route("/update/:id")
  .put(updateExperienceValidation, authentecation, updateExperience);
router
  .route("/delete/:id")
  .delete(deleteExperienceValidation, authentecation, deleteExperience);

export default router;
