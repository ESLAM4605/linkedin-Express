import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { CatchError, AppError } from "../../utils/errorhandler.js";
import Jwt from "jsonwebtoken";
import { Op, where } from "sequelize";
import experienceModel from "../../experience/model/experiences.model.js";
import UserSkillModel from "../../experience/model/user-skills.model.js";
import skillModel from "../../skill/model/skills.model.js";
import imageModel from "../../image/models/images.model.js";
import languageModel from "../../languages/models/languages.model.js";
import postModel from "../../post/models/posts.model.js";
import friendshipModel from "../models/friendships.model.js";
import sendmail from "../../utils/email.sender.js";
import commentModel from "../../post/models/comments.model.js";

export const searchForOneUser = CatchError(async (req, res) => {
  const { user } = req.query;
  const users = await userModel.findAll({
    where: {
      [Op.or]: [{ userName: user }, { firstName: user }, { lastName: user }],
      removed: false,
    },
  });
  if (users.length) return res.status(200).json(users);
  throw new AppError("No user found", 404);
});
export const signUp = CatchError(async (req, res) => {
  const { userName, firstName, lastName, email, password, age } = req.body;

  const user = await userModel.findOne({
    where: {
      [Op.or]: [
        {
          userName,
        },
        {
          email,
        },
      ],
    },
  });

  if (user) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.ROUNDS)
  );

  const token = Jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "10min",
  });

  const newUser = await userModel.create({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    age,
  });

  const createLink = `${process.env.BACKEND_URL}/users/verify/${token}`;

  if (req.file) {
    const img = await imageModel.create({
      name: req.file.originalname,
      path: req.file.filename,
      userId: newUser.id,
    });

    const updatedUser = await userModel.update(
      { profilePicture: img.id },
      { where: { id: newUser.id } }
    );
  }

  const message = await sendmail({
    to: email,
    subject: "Verify your account",
    text: `Please copy the link to Your URL incase it is not Clickble :
     ${createLink}`,
  });
  if (newUser)
    return res.status(201).json({
      message: "Signed Up Successfully",
      // updatedUser,
    });

  throw new AppError("Something went wrong", 500);
});

export const verfyEmail = CatchError(async (req, res) => {
  const { token } = req.params;
  const { email } = Jwt.verify(token, process.env.SECRET_KEY);

  const user = await userModel.findOne({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const updatedUser = await userModel.update(
    { isVerified: true },
    { where: { email } }
  );

  if (updatedUser) return res.status(200).json({ message: "Email verified" });

  throw new AppError("Something went wrong", 500);
});

export const forgetPassword = CatchError(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const token = Jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "10min",
  });
  const forgetPasswordLink = `${process.env.BACKEND_URL}/users/reset/${token}`;
  const sendmailer = await sendmail({
    to: email,
    subject: "Reset your password",
    text: `Please copy the link to Your URL incase it is not Clickble :
     ${forgetPasswordLink}`,
  });

  res.status(200).json({ message: "Email sent successfully" });
});

export const resetPassword = CatchError(async (req, res) => {
  const { token } = req.params;

  const { email } = Jwt.verify(token, process.env.SECRET_KEY);

  const { newPassword } = req.body;

  const user = await userModel.findOne({ where: { email } });

  if (!user) throw new AppError("User not found", 404);

  const hashedPassword = await bcrypt.hash(
    newPassword,
    parseInt(process.env.ROUNDS)
  );

  const updatePassword = await userModel.update(
    { password: hashedPassword },
    { where: { email } }
  );

  res.status(200).json({ message: "Password reset successfully" });
});

export const signIn = CatchError(async (req, res) => {
  const { email, password } = req.body;

  const isUser = await userModel.findOne({
    where: { email },
  });

  if (!isUser)
    throw new AppError("User dosn't exist, Please Sign-up first", 400);

  const isPassword = await bcrypt.compare(password, isUser.password);

  if (!isPassword) throw new AppError("Incorrect Password", 400);

  const { id, userName, firstName, lastName, age, role } = isUser;

  const token = Jwt.sign(
    { id, userName, firstName, lastName, age, role },
    process.env.SECRET_KEY,
    { expiresIn: "15min" }
  );
  const refreshToken = Jwt.sign(
    { id, userName, firstName, lastName, age, role, isRefresh: true },
    process.env.SECRET_KEY,
    { expiresIn: "1y" }
  );

  res.status(200).json({
    message: `Logged in successfully,Welcome ${userName}!`,
    token,
    refreshToken,
  });
});

export const refreshToken = CatchError(async (req, res) => {
  const refreshToken = req.header("refreshToken");
  const decoded = Jwt.verify(refreshToken, process.env.SECRET_KEY);

  // Insure that the user send a refresh token
  if (!decoded.isRefresh) throw new AppError("Invalid token", 401);

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) throw new AppError("User not found", 404);

  const regularToken = Jwt.sign(
    {
      id: decoded.id,
      userName: decoded.userName,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      age: decoded.age,
      role: decoded.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "15min" }
  );
  res.json({ meesage: "Refreshed successfully", regularToken: regularToken });
});

export const updateUser = CatchError(async (req, res) => {
  const { id } = req.user;

  const { userName, firstName, lastName, age, About } = req.body;

  const user = await userModel.findByPk(id, { where: { removed: false } });

  if (!user) throw new AppError("User not found", 404);

  const checkEmail = await userModel.findOne({ where: { userName } });

  if (checkEmail && checkEmail.id !== id)
    throw new AppError("user already exist", 400);

  const data = await userModel.update(
    {
      userName,
      firstName,
      lastName,
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
  const isUser = await userModel.findByPk(id, { where: { removed: false } });
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

  const isPost = await postModel.destroy({
    where: {
      userId: id,
    },
  });

  const isSkills = await UserSkillModel.destroy({
    where: {
      userId: id,
    },
  });

  const isExperience = await experienceModel.destroy({
    where: {
      userId: id,
    },
  });

  const isLanguage = await languageModel.destroy({
    where: {
      userId: id,
    },
  });

  const data = await userModel.destroy({ where: { id } });

  res.status(200).json({ message: "User deleted", data });
});

export const getProfileInfo = CatchError(async (req, res) => {
  const isUser = await userModel.findOne({
    where: { userName: req.query.userName },
    attributes: [
      "userName",
      "firstName",
      "lastName",
      "profilePicture",
      "age",
      "email",
      "About",
    ],
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
      },
      {
        model: UserSkillModel,
        attributes: ["skillId"],
        include: [{ model: skillModel, attributes: ["name"] }],
        limit: 1,
      },
      {
        model: languageModel,
        attributes: ["language", "proficiency"],
      },
    ],
  });
  if (!isUser) throw new AppError("User not found", 404);
  res.status(200).json(isUser);
});

export const getUserPosts = CatchError(async (req, res) => {
  const isUserPosts = await userModel.findOne({
    where: {
      userName: req.query.userName,
      removed: false,
    },
    attributes: { exclude: ["password", "role", "id"] },
    include: [
      {
        model: postModel,
        attributes: ["id", "title", "content"],
      },
    ],
  });
  res.status(200).json(isUserPosts);
});

// Languages

export const createlanguage = CatchError(async (req, res) => {
  const { id } = req.user;

  const islanguage = await languageModel.findOne({
    where: { language: req.body.language, userId: id },
  });

  if (islanguage) throw new AppError("Language already exists", 400);
  req.body.userId = id;
  const data = await languageModel.create(req.body);
  if (data)
    res.status(201).json({ message: "language added successfully", data });
});

export const updateLanguage = CatchError(async (req, res) => {
  const { id } = req.user;

  if (parseInt(req.params.userId) !== id)
    throw new AppError("can't update other user's language", 400);

  const language = await languageModel.findOne({
    where: { language: req.body.language, userId: id },
  });

  if (language) throw new AppError("Language already exists", 400);

  const isExistLanguage = await languageModel.findOne({
    where: { id: req.params.id, userId: id },
  });

  if (!isExistLanguage) throw new AppError("can't find Language", 404);
  const data = await languageModel.update(req.body, {
    where: { id: req.params.id },
  });

  res.status(200).json({ message: "updated", data });
});

export const deleteLanguage = CatchError(async (req, res) => {
  const { id } = req.user;

  if (parseInt(req.params.userId) !== id)
    throw new AppError("can't delete other user's language", 400);

  const isLanguage = await languageModel.findOne({
    where: { id: req.params.id, userId: id },
  });

  if (!isLanguage) throw new AppError("can't find Language", 404);

  const data = await languageModel.destroy({ where: { id: req.params.id } });
  res.status(200).json({ message: "deleted", data });
});

// Friendships
export const getFriendships = CatchError(async (req, res) => {
  const data = await friendshipModel.findAll();
  res.status(200).json(data);
});

export const createFriendship = CatchError(async (req, res) => {
  const { id } = req.user;
  const user2 = await userModel.findOne({
    where: { id: req.params.user2Id },
  });
  if (!user2) throw new AppError("can't find user", 404);

  if (user2.id === id) throw new AppError("can't add yourself as friend", 400);

  const existingRequest = await friendshipModel.findOne({
    where: {
      [Op.or]: [
        { user1Id: id, user2Id: req.params.user2Id },
        { user2Id: id, user1Id: req.params.user2Id },
      ],
      status: ["pending", "accepted"],
    },
  });

  if (existingRequest) {
    throw new AppError("Friend request already sent", 400);
  }

  const data = await friendshipModel.create({
    user1Id: id,
    user2Id: parseInt(req.params.user2Id),
  });
  res.status(201).json({ message: "Friend request sent", data });
});

export const rejectRequest = CatchError(async (req, res) => {
  const { id: user2Id } = req.user;
  const findFriendshipreq = await friendshipModel.findOne({
    where: {
      user2Id: user2Id,
      status: "pending",
      id: req.params.id,
    },
  });
  if (!findFriendshipreq) throw new AppError("can't find request", 404);

  const data = await friendshipModel.update(
    { status: "rejected" },
    { where: { id: req.params.id } }
  );

  res.status(200).json({ message: "Request rejected", data });
});
export const acceptRequest = CatchError(async (req, res) => {
  const { id: user2Id } = req.user;

  const findFriendshipreq = await friendshipModel.findOne({
    where: {
      user2Id: user2Id,
      status: "pending",
      id: req.params.id,
    },
  });

  if (!findFriendshipreq) throw new AppError("can't find request", 404);

  const data = await friendshipModel.update(
    { status: "accepted" },
    { where: { id: req.params.id } }
  );

  res.status(200).json({ message: "Request accepted", data });
});

export const deleteFriendship = CatchError(async (req, res) => {
  const { id } = req.user;
  const data = await friendshipModel.destroy({
    where: { id: req.params.id, user1Id: id, status: "pending" },
  });
  if (!data) throw new AppError("can't find friendship request", 404);
  res.status(200).json({ message: "deleted", data });
});
export const listOfFriends = CatchError(async (req, res) => {
  const { id } = req.user;

  const data = await friendshipModel.findAll({
    where: { [Op.or]: [{ user1Id: id }, { user2Id: id }], status: "accepted" },
  });
  res.status(200).json(data);
});
export const listOfPendingRecivedRequestes = CatchError(async (req, res) => {
  const { id } = req.user;
  const data = await friendshipModel.findAll({
    where: { user2Id: id, status: "pending" },
    limit: 10,
  });
  res.status(200).json(data);
});
export const listOfPendingSentRequestes = CatchError(async (req, res) => {
  const { id } = req.user;
  const data = await friendshipModel.findAll({
    where: { user1Id: id, status: "pending" },
    limit: 10,
  });
  res.status(200).json(data);
});

export const getListOfFriends = CatchError(async (req, res) => {
  const { id } = req.user;
  const user = await userModel.findOne({
    where: { id },
    attributes: {
      exclude: [
        "password",
        "role",
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "About",
      ],
    },
    include: [
      {
        model: friendshipModel,
        as: "User1Friendships",
        include: [
          {
            model: userModel,
            as: "User2",
            attributes: {
              exclude: [
                "password",
                "role",
                "id",
                "createdAt",
                "updatedAt",
                "deletedAt",
                "About",
              ],
            },
          },
        ],
        where: {
          status: "accepted",
        },
        limit: 10,
      },
      {
        model: friendshipModel,
        as: "User2Friendships",
        include: [
          {
            model: userModel,
            as: "User1",
            attributes: {
              exclude: [
                "password",
                "role",
                "id",
                "createdAt",
                "updatedAt",
                "deletedAt",
                "About",
              ],
            },
          },
        ],
        where: {
          status: "accepted",
        },
      },
    ],
  });
  res.status(200).json({ data: user });
});

// Get All Posts of friends (User Feed)
export const getAllPostsOfFriends = CatchError(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const friendsPosts = await userModel.findOne({
    where: { id },
    attributes: {
      exclude: [
        "password",
        "role",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "About",
      ],
    },
    include: [
      {
        model: friendshipModel,
        as: "User1Friendships",
        attributes: ["id", "status", "user1Id", "user2Id"],
        include: [
          {
            model: userModel,
            as: "User2",
            attributes: ["id", "userName"],
            include: [
              {
                model: postModel,
                as: "Posts",
                attributes: ["id", "title", "content", "createdAt"],
                order: [["createdAt", "DESC"]],
                include: [
                  {
                    model: commentModel,
                    attributes: ["id", "content"],
                    include: [
                      {
                        model: userModel,
                        attributes: ["id", "userName"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        where: {
          status: "accepted",
        },
      },
      {
        model: friendshipModel,
        as: "User2Friendships",
        attributes: ["id", "status", "user1Id", "user2Id"],
        include: [
          {
            model: userModel,
            as: "User1",
            attributes: ["id", "userName"],
            include: [
              {
                model: postModel,
                as: "Posts",
                attributes: ["id", "title", "content", "createdAt"],
                order: [["createdAt", "DESC"]],
                include: [
                  {
                    model: commentModel,
                    attributes: ["id", "content"],
                    include: [
                      {
                        model: userModel,
                        attributes: ["id", "userName"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        where: {
          status: "accepted",
        },
      },
    ],
  });
  res.status(200).json(friendsPosts);
});
