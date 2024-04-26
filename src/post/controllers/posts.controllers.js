import postModel from "../models/posts.model.js";
import { AppError, CatchError } from "../../utils/errorhandler.js";
import commentModel from "../models/comments.model.js";
import userModel from "../../user/models/user.model.js";

export const getAllPosts = CatchError(async (req, res) => {
  const posts = await postModel.findAll();
  res.status(200).json(posts);
});

export const getPost = CatchError(async (req, res) => {
  const post = await postModel.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(post);
});

export const createPost = CatchError(async (req, res) => {
  const { id } = req.user;
  req.body.userID = id;
  const createPost = await postModel.create(req.body);
  res.status(201).json({ posted: true, message: createPost });
});

export const updatePost = CatchError(async (req, res) => {
  const { id } = req.user;
  const isPost = await postModel.findOne({
    where: { id: req.params.id, userID: id },
  });
  if (!isPost) throw new AppError("can't find Post", 404);
  const updatePost = await postModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updatePost });
});

export const deletePost = CatchError(async (req, res) => {
  const { id } = req.user;
  const isPost = await postModel.findOne({
    where: { id: req.params.id, userID: id },
  });
  if (!isPost) throw new AppError("can't find Post", 404);

  const deletPost = await postModel.destroy({ where: { id: isPost.id } });
  res.status(200).json({ message: "deleted", deletPost });
});

export const getAllComments = CatchError(async (req, res) => {
  const comments = await commentModel.findAll();
  res.status(200).json(comments);
});

export const createComment = CatchError(async (req, res) => {
  const { id } = req.user;
  const post = await postModel.findOne({
    where: { id: req.params.id },
  });
  if (!post) throw new AppError("can't find Post", 404);

  const newComment = await commentModel.create({
    userId: id,
    postId: parseInt(req.params.id),
    content: req.body.content,
  });
  res.status(201).json({ posted: true, message: newComment });
});

export const updateComment = CatchError(async (req, res) => {
  const { id } = req.user;
  const comment = await commentModel.findOne({
    where: { id: req.params.id, userId: id },
  });
  if (!comment) throw new AppError("can't find this Comment", 404);

  const updateComment = await commentModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updateComment });
});

export const deleteComment = CatchError(async (req, res) => {
  const { id } = req.user;
  const comment = await commentModel.findOne({
    where: { id: req.params.id, userId: id },
  });
  if (!comment) throw new AppError("can't find this Comment", 404);
  const deleteComment = await commentModel.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "deleted", deleteComment });
});

export const getAllCommentsOnPost = CatchError(async (req, res, next) => {
  const comments = await postModel.findAll({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content"],
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
  });
  res.status(200).json(comments);
});
