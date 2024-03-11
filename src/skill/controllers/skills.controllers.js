import { AppError, CatchError } from "../../utils/errorhandler.js";
import skillModel from "../model/skills.model.js";

export const getAllSkills = CatchError(async (req, res) => {
  const skills = await skillModel.findAll();
  if (skills.length === 0) throw new AppError("No skills found", 404);
  res.status(200).json(skills);
});

export const createSkill = CatchError(async (req, res) => {
  const skill = await skillModel.findOne({ where: { name: req.body.name } });
  if (skill) throw new AppError("Skill already exists");
  const createSkill = await skillModel.create(req.body);
  res.status(201).json({ created: true, message: createSkill });
});

export const updateSkill = CatchError(async (req, res) => {
  const skill = await skillModel.findOne({ where: { id: req.params.id } });
  if (!skill) throw new AppError("Skill not found", 404);
  const updateSkill = await skillModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updateSkill });
});

export const deleteSkill = CatchError(async (req, res) => {
  const skill = await skillModel.findOne({ where: { id: req.params.id } });
  if (!skill) throw new AppError("Skill not found", 404);
  const deletSkill = await skillModel.destroy({ where: { id: req.params.id } });
  res.status(200).json({ message: "deleted", deletSkill });
});
