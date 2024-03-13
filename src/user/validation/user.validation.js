import Joi from "joi";
import { validator } from "../../utils/validation.middelware.js";
export const signUpValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      userName: Joi.string().min(3).max(30).required(),
      firstName: Joi.string().min(3).max(30).required(),
      lastName: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      age: Joi.number().integer().min(10).max(100),
    },
  });
  validator(req, schema);
  next();
};
export const signInValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  });
  validator(req, schema);
  next();
};

export const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    body: {
      userName: Joi.string().min(3).max(30),
      firstName: Joi.string().min(3).max(30),
      lastName: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      password: Joi.string(),
      age: Joi.number().integer().min(10).max(100),
      role: Joi.string().valid("user", "admin"),
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
