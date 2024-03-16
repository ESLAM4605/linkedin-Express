import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";

export const createEducationVali = (req, res, next) => {
  const dateFormatRegex =
    /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

  const schema = Joi.object({
    body: {
      school: Joi.string().min(3).max(30),
      degree: Joi.string().min(3).max(30),
      fieldOfStudy: Joi.string().min(3).max(30),
      Description: Joi.string().min(3).max(200),
      startDate: Joi.string().regex(dateFormatRegex),
      endDate: Joi.string().regex(dateFormatRegex),
    },
  });

  validator(req, schema);
  next();
};

export const updateEducationVali = (req, res, next) => {
  const dateFormatRegex =
    /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

  const schema = Joi.object({
    body: {
      school: Joi.string().min(3).max(30),
      degree: Joi.string().min(3).max(30),
      fieldOfStudy: Joi.string().min(3).max(30),
      Description: Joi.string().min(3).max(200),
      startDate: Joi.string().regex(dateFormatRegex),
      endDate: Joi.string().regex(dateFormatRegex),
    },
    params: {
      id: Joi.number().integer().min(1).required(),
    },
  });

  validator(req, schema);
  next();
};

export const deleteEducationValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      id: Joi.number().integer().min(1).required(),
    },
  });

  validator(req, schema);
  next();
};
