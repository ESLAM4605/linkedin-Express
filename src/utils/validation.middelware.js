import { AppError } from "./errorhandler.js";

export const validator = (req, schema) => {
  const { body, params, query } = req;
  const { error } = schema.validate(
    {
      body,
      params,
      query,
      ...(req.file && { file: req.file }),
      ...(req.files && { file: req.files }),
    },
    { abortEarly: false }
  );
  if (error)
    throw new AppError(error.details[0].message.split('"').join(""), 400);
};
