import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { CatchError, AppError } from "../../utils/errorhandler.js";
export const getAllUsers = CatchError(async (req, res) => {
  const users = await userModel.findAll();
  if (users.length === 0) throw new AppError("No users found", 404);
  res.status(200).json(users);
});

export const signup = CatchError(async (req, res) => {
  const { userName, firstName, lastName, email, password, age, role } =
    req.body;
  const user = await userModel.findOne({ where: { email } });
  if (user) throw new AppError("User already exists", 400);
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = await userModel.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    age,
    role,
  });
  if (newUser) return res.status(201).json({ message: "User Added", newUser });
  throw new AppError("Something went wrong", 500);
});
