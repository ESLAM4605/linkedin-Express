import postModel from "../models/posts.model.js";

export const getAllPosts = async (req, res) => {
  const posts = await postModel.findAll();
  res.status(200).json(posts);
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await postModel.findByPk(id);
  res.status(200).json(post);
};
