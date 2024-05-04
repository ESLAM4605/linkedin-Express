import { Router } from "express";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  searchByQuery,
  updateSkill,
} from "../controllers/skills.controllers.js";
import { authentecation, authorized } from "../../user/auth/auth.js";
import {
  createSkillValidation,
  deleteSkillValidation,
  updateSkillValidation,
} from "../validation/skills.validation.js";

const router = Router();

router
  .route("/")
  .get(authentecation, authorized("admin"), getAllSkills)
  .post(
    createSkillValidation,
    authentecation,
    authorized("admin"),
    createSkill
  );

router.get("/search", searchByQuery);
router
  .route("/update/:id")
  .put(updateSkillValidation, authentecation, authorized("admin"), updateSkill);
router
  .route("/delete/:id")
  .delete(
    deleteSkillValidation,
    authentecation,
    authorized("admin"),
    deleteSkill
  );

export default router;
