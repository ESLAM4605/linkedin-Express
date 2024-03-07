import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password, age, role } =
      req.body;

    const user = await userModel.findOne({ where: { email } });
    if (user) throw new Error("User already exists");

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
    res.status(201).json("User Added");
  } catch (error) {
    res.status(400).json(error);
  }
};
