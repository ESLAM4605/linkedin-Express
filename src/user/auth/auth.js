import Jwt from "jsonwebtoken";
import { AppError } from "../../utils/errorhandler.js";
export const authentecation = (req, res, next) => {
  const token = req.header("token");
  if (!token) throw new AppError("UnAuthorized", 401);
  Jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    // err
    if (err) throw new AppError(err.message, 498);
    // decoded undefined
    req.user = decoded;
  });
  next();
};
export const authorized = (role) => {
  return (req, res, next) => {
    const { role: userRole } = req.user;
    if (role !== userRole) throw new AppError("Forbidden", 403);
    next();
  };
};
