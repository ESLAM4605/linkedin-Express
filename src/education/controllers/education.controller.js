import educationModel from "../model/education.model.js";
import { CatchError, AppError } from "../../utils/errorhandler.js";

export const getAllEducations = CatchError(async (req, res) => {
  const isEducation = await educationModel.findAll();
  res.status(200).json(isEducation);
});

export const createEducation = CatchError(async (req, res) => {
  const { id } = req.user;

  req.body.userId = id;

  const education = await educationModel.create(req.body);

  if (!education) throw new AppError("Failed to create education", 500);

  res.status(201).json({ message: "Created", education });
});

export const updateEducation = CatchError(async (req, res) => {
  const { id } = req.user;

  const isEducation = await educationModel.findOne({ id: req.params.id });

  if (isEducation.userId !== id)
    throw new AppError("You are not the Owner", 400);

  const updateEduc = await educationModel.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  if (!updateEduc) throw new AppError("Failed to update education", 500);
  res.status(200).json({ message: "Updated", updateEduc });
});

export const deleteEducation = CatchError(async (req, res) => {
  const { id } = req.user;

  const isEducation = await educationModel.findOne({ id: req.params.id });
  if (isEducation.userId !== id)
    throw new AppError("You are not the Owner", 400);

  const deleteEduc = await educationModel.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!deleteEduc) throw new AppError("Failed to delete education", 500);

  res.status(200).json({ message: "Deleted", deleteEduc });
});
