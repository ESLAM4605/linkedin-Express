import postModel from "../models/posts.model.js";
import { AppError, CatchError } from "../../utils/errorhandler.js";
export const getAllPosts = CatchError(async (req, res) => {
  const posts = await postModel.findAll();
  if (posts.length === 0) throw new AppError("No posts found", 404);
  res.status(200).json(posts);
});

export const getPost = CatchError(async (req, res) => {
  const { id } = req.params;
  const post = await postModel.findByPk(id);
  if (!post) throw new AppError("No posts found", 404);
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
  const isPost = await postModel.findByPk(req.params.id);
  if (!isPost) throw new AppError("can't find Post", 404);
  if (isPost.userID !== id) throw new AppError("You are not the Owner", 400);
  const updatePost = await postModel.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "updated", updatePost });
});

export const deletePost = CatchError(async (req, res) => {
  const { id } = req.user;
  const isPost = await postModel.findByPk(req.params.id);
  if (isPost.userID !== id) throw new AppError("You are not the Owner", 400);
  const deletPost = await postModel.destroy({ where: { id: isPost.id } });
  res.status(200).json({ message: "deleted", deletPost });
});
