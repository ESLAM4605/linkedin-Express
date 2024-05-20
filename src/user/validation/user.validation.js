import Joi from "../../middlewares/joi.extend.js";
import { validator } from "../../utils/validation.middelware.js";
export const signUpValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      userName: Joi.string().min(3).max(30).escapeHTML().required(),
      firstName: Joi.string().min(3).max(30).escapeHTML().required(),
      lastName: Joi.string().min(3).max(30).escapeHTML().required(),
      email: Joi.string().email().escapeHTML().required(),
      password: Joi.string().min(8).max(16).escapeHTML().required(),
      age: Joi.number().integer().min(10).max(100),
    },
    file: Joi.object(),
  });
  validator(req, schema);
  next();
};
export const signInValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      email: Joi.string().email().escapeHTML().required(),
      password: Joi.string().escapeHTML().required(),
    },
  });
  validator(req, schema);
  next();
};

export const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      userName: Joi.string().min(3).max(30).escapeHTML(),
      firstName: Joi.string().min(3).max(30).escapeHTML(),
      lastName: Joi.string().min(3).max(30).escapeHTML(),
      password: Joi.string().escapeHTML(),
      age: Joi.number().integer().min(10).max(100),
      About: Joi.string().min(3).max(200).escapeHTML(),
    },
  });
  validator(req, schema);
  next();
};
export const updateInActiveValidation = (req, res, next) => {
  const schema = Joi.object({
    query: {
      userName: Joi.string().min(3).max(30).escapeHTML().required(),
    },
  });
  validator(req, schema);
  next();
};
export const changingPasswordVali = (req, res, next) => {
  const schema = Joi.object({
    body: {
      oldPassword: Joi.string().min(3).max(12).escapeHTML().required(),
      newPassword: Joi.string().min(3).max(12).escapeHTML().required(),
      confirmPassword: Joi.string().min(3).max(12).escapeHTML().required(),
    },
  });
  validator(req, schema);
  next();
};
