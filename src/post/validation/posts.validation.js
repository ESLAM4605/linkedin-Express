import Joi from "../../middlewares/joi.extend.js";
import { validator } from "../../utils/validation.middelware.js";
export const createPostValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      title: Joi.string().min(3).max(30).escapeHTML().required(),
      content: Joi.string().min(3).max(200).escapeHTML().required(),
    },
  });
  validator(req, schema);
  next();
};

export const updatePostValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      title: Joi.string().min(3).max(30).escapeHTML().required(),
      content: Joi.string().min(3).max(200).escapeHTML().required(),
    },
    params: { id: Joi.number().integer().min(1).required() },
  });
  validator(req, schema);
  next();
};
