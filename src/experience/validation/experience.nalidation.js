import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";

export const createExperienceValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      title: Joi.string().min(3).max(100).required(),
      employmentType: Joi.string().valid(
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Apprenticeship",
        "Volunteer",
        "Freelance"
      ),
      CompanyName: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      description: Joi.string(),
      skills: Joi.array().items(Joi.number().integer()).required(),
    },
  });
  validator(req, schema);
  next();
};
export const updateExperienceValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      title: Joi.string().min(3).max(100),
      employmentType: Joi.string().valid(
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Apprenticeship",
        "Volunteer",
        "Freelance"
      ),
      CompanyName: Joi.string(),
      location: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      description: Joi.string(),
    },
    params: {
      id: Joi.number().integer().required(),
    },
  });
  validator(req, schema);
  next();
};

export const deleteExperienceValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      id: Joi.number().integer().required(),
    },
  });
  validator(req, schema);
  next();
};
