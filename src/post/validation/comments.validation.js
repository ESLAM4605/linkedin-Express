import Joi from "../../middlewares/joi.extend.js";
import { validator } from "../../utils/validation.middelware.js";
export const createCommentValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      content: Joi.string().min(1).max(200).escapeHTML().required(),
    },
    params: { postId: Joi.number().integer().min(1).required() },
  });
  validator(req, schema);
  next();
};

export const updateCommentValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      content: Joi.string().min(1).max(200).escapeHTML().required(),
    },
    params: {
      postId: Joi.number().integer().min(1).required(),
      commentId: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};
export const deleteCommentValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      postId: Joi.number().integer().min(1).required(),
      commentId: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};
