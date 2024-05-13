import postModel from "../models/posts.model.js";
import { AppError, CatchError } from "../../utils/errorhandler.js";
import commentModel from "../models/comments.model.js";
import userModel from "../../user/models/user.model.js";
import redis, { addPostToRedis, getPostsFromRedis } from "../../Redis/redis.js";

export const getPost = CatchError(async (req, res) => {
  console.log(req.params.id);
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
  await addPostToRedis(createPost);
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

export const createComment = CatchError(async (req, res) => {
  const { id } = req.user;

  const post = await postModel.findOne({
    where: { id: req.params.postId },
  });

  if (!post) throw new AppError("can't find Post", 404);

  const newComment = await commentModel.create({
    userId: id,
    postId: parseInt(req.params.postId),
    content: req.body.content,
  });

  if (!newComment) throw new AppError("can't create empty comment", 400);

  res.status(201).json({ posted: true, message: newComment });
});

export const updateComment = CatchError(async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;

  const comment = await commentModel.findOne({
    where: { id: req.params.commentId, userId: id, postId: postId },
  });

  if (!comment) throw new AppError("can't find this Comment", 404);

  const updateComment = await commentModel.update(req.body, {
    where: { id: req.params.commentId },
  });

  res.status(200).json({ message: "updated", updateComment });
});

export const deleteComment = CatchError(async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;
  const comment = await commentModel.findOne({
    where: { id: req.params.commentId, userId: id, postId: postId },
  });
  if (!comment) throw new AppError("can't find this Comment", 404);
  const deleteComment = await commentModel.destroy({
    where: { id: req.params.commentId },
  });
  res.status(200).json({ message: "deleted", deleteComment });
});

export const getAllCommentsOnPost = CatchError(async (req, res, next) => {
  const comments = await postModel.findAll({
    where: {
      id: req.params.postId,
    },
    attributes: ["id", "title", "content"],
    include: [
      {
        model: commentModel,
        attributes: ["id", "content", "createdAt", "updatedAt"],
        include: [
          {
            model: userModel,
            attributes: ["id", "userName", "profilePicture"],
          },
        ],
      },
    ],
  });
  res.status(200).json(comments);
});

export const getPostsWorldFeed = CatchError(async (req, res) => {
  const { offset, limit = 10 } = req.query;
  const posts = await getPostsFromRedis(+offset, limit);

  res.json(posts);
});
