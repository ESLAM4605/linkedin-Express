import { AppError, CatchError } from "../../utils/errorhandler.js";
import experienceModel from "../model/experiences.model.js";
import UserSkillModel from "../model/user-skills.model.js";
import sequelize from "../../../DB/db.connction.js";
export const getAllExperiences = CatchError(async (req, res) => {
  const experiences = await experienceModel.findAll();
  res.status(200).json(experiences);
});

export const createExperience = CatchError(async (req, res) => {
  const { id: userId } = req.user;

  req.body.userId = userId;

  const { skills, ...otherFields } = req.body;

  otherFields.userId = userId;

  const transaction = await sequelize.transaction();

  try {
    const experience = await experienceModel.create(req.body, {
      transaction: transaction,
    });

    const userSkills = skills.map((skill) => ({
      userId,
      experienceId: experience.id,
      skillId: skill,
    }));

    // Bulk create userSkills within the transaction
    await UserSkillModel.bulkCreate(userSkills, { transaction: transaction });

    // If all operations are successful, commit the transaction
    await transaction.commit();

    res.status(201).json({ message: "Added Successfully", experience });
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
});

export const updateExperience = CatchError(async (req, res) => {
  const { id } = req.user;
  const isExperience = await experienceModel.findOne({
    where: { id: req.params.id, userId: id },
  });
  if (!isExperience) throw new AppError("can't find Experience", 404);

  const updateExperience = await experienceModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updateExperience });
});

export const deleteExperience = CatchError(async (req, res) => {
  const { id } = req.user;

  const transaction = await sequelize.transaction();

  try {
    const isExperience = await experienceModel.findOne(
      {
        where: { id: req.params.id, userId: id },
      },
      { transaction: transaction }
    );
    if (!isExperience) throw new AppError("can't find Experience", 404);
    const deleteUserSkills = await UserSkillModel.destroy(
      {
        where: { experienceId: isExperience.id },
      },
      { transaction: transaction }
    );
    if (!deleteUserSkills) throw new AppError("can't find user-skill", 404);
    const deletExperience = await experienceModel.destroy(
      {
        where: { id: isExperience.id },
      },
      { transaction: transaction }
    );
    await transaction.commit();
    res.status(200).json({ message: "deleted", deletExperience });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
