import { AppError, CatchError } from "../../utils/errorhandler.js";
import experienceModel from "../model/experiences.model.js";
import UserSkillModel from "../model/user-skills.model.js";
import skillModel from "../../skill/model/skills.model.js";
export const getAllExperiences = CatchError(async (req, res) => {
  const experiences = await experienceModel.findAll();
  if (experiences.length === 0) {
    throw new AppError("No experiences found", 404);
  }
  res.status(200).json(experiences);
});

export const createExperience = CatchError(async (req, res) => {
  const { id: userId } = req.user;
  req.body.userId = userId;

  const { skills, ...otherFields } = req.body;

  otherFields.userId = userId;
  const existingSkills = await UserSkillModel.findAll({
    where: {
      userId: userId,
      skillId: skills,
    },
  });
  console.log(existingSkills);

  if (existingSkills.length > 0) {
    const existingSkillNames = existingSkills
      .map((skill) => skill.skillId)
      .join(", ");

    throw new AppError(
      `Cannot choose skills (${existingSkillNames}) again.`,
      400
    );
  }

  const existingSkills = await UserSkillModel.findAll({
    where: {
      userId: userId,
      skillId: skills,
    },
  });
  console.log(existingSkills);

  if (existingSkills.length > 0) {
    const existingSkillNames = existingSkills
      .map((skill) => skill.skillId)
      .join(", ");
    console.log();
    throw new AppError(
      `Cannot choose skills (${existingSkillNames}) again.`,
      400
    );
  }

  const experience = await experienceModel.create(req.body);

  const userSkills = [];

  for (const skill of skills) {
    userSkills.push({
      userId,
      experienceId: experience.id,
      skillId: skill,
    });
  }

  await UserSkillModel.bulkCreate(userSkills);

  res.status(201).json({ message: "Added Successfully", experience });
});

export const updateExperience = CatchError(async (req, res) => {
  const { id } = req.user;
  const isExperience = await experienceModel.findByPk(req.params.id);
  if (!isExperience) throw new AppError("can't find Experience", 404);
  if (isExperience.userId !== id)
    throw new AppError("You are not the Owner", 400);
  const updateExperience = await experienceModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updateExperience });
});

export const deleteExperience = CatchError(async (req, res) => {
  const { id } = req.user;

  const isExperience = await experienceModel.findByPk(req.params.id);
  if (!isExperience) throw new AppError("can't find Experience", 404);

  if (isExperience.userId !== id)
    throw new AppError("You are not the Owner", 400);
  const deletExperience = await experienceModel.destroy({
    where: { id: isExperience.id },
  });
  res.status(200).json({ message: "deleted", deletExperience });
});
