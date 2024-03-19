import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";
export const createFriendshipValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      user2Id: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};
export const rejectRequestValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      id: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};

export const acceptRequestValidation = (req, res, next) => {
  const schema = Joi.object({
    params: {
      id: Joi.number().integer().min(1).required(),
    },
  });
  validator(req, schema);
  next();
};
export const updateInActiveValidation = (req, res, next) => {
  const schema = Joi.object({
    query: {
      userName: Joi.string().min(3).max(30).required(),
    },
  });
  validator(req, schema);
  next();
};
export const changingPasswordVali = (req, res, next) => {
  const schema = Joi.object({
    body: {
      oldPassword: Joi.string().min(3).max(12).required(),
      newPassword: Joi.string().min(3).max(12).required(),
      confirmPassword: Joi.string().min(3).max(12).required(),
    },
  });
  validator(req, schema);
  next();
};
