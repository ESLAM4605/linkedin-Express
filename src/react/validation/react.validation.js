import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";

export const getOrDeleteReactsValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      postId: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};

export const createPostReactValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      reactionId: Joi.number().integer().min(1).required(),
    },
    params: {
      postId: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};
