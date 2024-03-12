import { AppError, CatchError } from "../../utils/errorhandler.js";
import skillModel from "../model/skills.model.js";
import { Op } from "sequelize";

export const getAllSkills = CatchError(async (req, res) => {
  const skills = await skillModel.findAll();
  res.status(200).json(skills);
});

export const createSkill = CatchError(async (req, res) => {
  const skill = await skillModel.findOne({ where: { name: req.body.name } });
  if (skill) throw new AppError("Skill already exists");
  const createSkill = await skillModel.create(req.body);
  res.status(201).json({ created: true, message: createSkill });
});
export const searchByQuery = CatchError(async (req, res) => {
  const { searching } = req.query;
  const skill = await skillModel.findAll({
    where: { name: { [Op.like]: `%${searching}%` } },
  });
  if (!skill) throw new AppError("can't find what you searching for", 404);
  res.status(200).json(skill);
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
