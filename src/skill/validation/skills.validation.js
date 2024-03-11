import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";
export const createSkillValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      name: Joi.string().min(3).max(30).required(),
    },
  });
  validator(req, schema);
  next();
};

export const updateSkillValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      name: Joi.string().min(3).max(30),
    },
    params: { id: Joi.number().integer().min(1).required() },
  });
  validator(req, schema);
  next();
};
export const deleteSkillValidation = (req, res, next) => {
  const schema = Joi.object({
    params: { id: Joi.number().integer().min(1).required() },
  });
  validator(req, schema);
  next();
};
