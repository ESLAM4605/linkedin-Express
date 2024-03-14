import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { CatchError, AppError } from "../../utils/errorhandler.js";
import Jwt from "jsonwebtoken";
import { Op } from "sequelize";
import experienceModel from "../../experience/model/experiences.model.js";
import UserSkillModel from "../../experience/model/user-skills.model.js";
import skillModel from "../../skill/model/skills.model.js";
import imageModel from "../../image/models/images.model.js";

export const getAllUsers = CatchError(async (req, res) => {
  const users = await userModel.findAll();
  if (users.length === 0) throw new AppError("No users found", 404);
  res.status(200).json(users);
});
export const searchForOneUser = CatchError(async (req, res) => {
  const { user } = req.query;
  const users = await userModel.findAll({
    where: {
      [Op.or]: [{ userName: user }, { firstName: user }, { lastName: user }],
    },
  });
  if (users.length) return res.status(200).json(users);
  throw new AppError("No user found", 404);
});
export const signUp = CatchError(async (req, res) => {
  const { userName, firstName, lastName, email, password, age } = req.body;
  const user = await userModel.findOne({ where: { email } });
  if (user) throw new AppError("User already exists", 400);
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.ROUNDS)
  );
  // console.log(req.file.originalname);
  const newUser = await userModel.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    age,
  });

  const img = await imageModel.create({
    name: req.file.originalname,
    path: req.file.filename,
    userId: newUser.id,
  });

  const updatedUser = await userModel.update(
    { profilePicture: img.id },
    { where: { id: newUser.id } }
  );

  if (newUser)
    return res
      .status(201)
      .json({ message: "Signed Up Successfully", updatedUser });
  throw new AppError("Something went wrong", 500);
});
export const signIn = CatchError(async (req, res) => {
  const { email, password } = req.body;
  const isUser = await userModel.findOne({ where: { email } });
  if (!isUser) throw new AppError("Please Sign-up First", 400);
  const isPassword = await bcrypt.compare(password, isUser.password);
  if (!isPassword) throw new AppError("Incorrect Password", 400);
  const { id, userName, firstName, lastName, age, role } = isUser;
  const token = Jwt.sign(
    { id, userName, firstName, lastName, age, role },
    process.env.SECRET_KEY
  );
  res
    .status(200)
    .json({ message: `Logged in successfully,Welcome ${userName}`, token });
});

export const updateUser = CatchError(async (req, res) => {
  const { id } = req.user;
  const { userName, firstName, lastName, email, role, age, About } = req.body;
  const user = await userModel.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  const data = await userModel.update(
    {
      userName,
      firstName,
      lastName,
      email,
      role,
      age,
      About,
    },
    {
      where: {
        id: id,
      },
    },
    { new: true }
  );
  res.status(200).json({ message: "User updated", data });
});

export const changePassword = CatchError(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    throw new AppError("Passwords do not match", 400);
  if (newPassword === oldPassword)
    throw new AppError("Old password cannot be the same as new password", 400);
  const { id } = req.user;
  const isUser = await userModel.findByPk(id);
  if (!isUser) throw new AppError("User not found", 404);
  const isPassword = await bcrypt.compare(oldPassword, isUser.password);
  if (isPassword === false) throw new AppError("Incorrect Password", 400);
  const hashingNewPassword = await bcrypt.hash(newPassword, 10);
  const changingPassword = await userModel.update(
    { password: hashingNewPassword },
    { where: { id } }
  );
  if (!changingPassword) throw new AppError("Something went wrong", 500);
  res.status(200).json({ message: "Password changed" });
});

export const deleteUser = CatchError(async (req, res) => {
  const { id } = req.user;
  const user = await userModel.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  const data = await userModel.destroy({ where: { id } });
  res.status(200).json({ message: "User deleted", data });
});

export const getProfileInfo = CatchError(async (req, res) => {
  const isUser = await userModel.findOne({
    where: { userName: req.query.userName },
    attributes: { exclude: ["password", "role", "id"] },
    include: [
      {
        model: experienceModel,
        include: [
          {
            model: UserSkillModel,
            attributes: ["skillId"],
            include: { model: skillModel, attributes: ["name"] },
          },
        ],
        attributes: [
          "title",
          "employmentType",
          "CompanyName",
          "location",
          "startDate",
          "endDate",
          "description",
        ],
        limit: 1,
      },
      {
        model: UserSkillModel,
        attributes: ["skillId"],
        include: [{ model: skillModel, attributes: ["name"] }],
        limit: 1,
      },
    ],
  });

  if (!isUser) throw new AppError("User not found", 404);
  res.status(200).json(isUser);
});
