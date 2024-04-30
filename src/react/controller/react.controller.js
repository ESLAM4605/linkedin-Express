import reactionModel from "../model/reactions.model.js";
import userModel from "../../user/models/user.model.js";
import reactPostModel from "../model/reactonposts.model.js";
import postModel from "../../post/models/posts.model.js";
import { CatchError, AppError } from "../../utils/errorhandler.js";

export const getPostReactions = CatchError(async (req, res) => {
  const getPost = await postModel.findOne({
    where: {
      id: req.params.postId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    },
    include: [
      {
        model: reactPostModel,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt", "postId"],
        },
        include: [
          {
            model: userModel,
            attributes: ["firstName", "lastName", "userName"],
          },
        ],
      },
    ],
  });
  if (!getPost) throw new AppError("No post found", 404);
  res.status(200).json(getPost);
});

export const createReactOnPost = CatchError(async (req, res) => {
  const { id } = req.user;
  const { reactionId } = req.body;

  const getPost = await postModel.findByPk(req.params.postId);

  if (!getPost) throw new AppError("No post found", 404);
  const checkForExistReact = await reactPostModel.findOne({
    where: {
      userId: id,
      postId: req.params.postId,
    },
  });

  if (checkForExistReact)
    await reactPostModel.destroy({
      where: {
        userId: id,
        postId: req.params.postId,
      },
    });

  const createReact = await reactPostModel.create({
    reactionId,
    postId: getPost.id,
    userId: id,
  });

  if (!createReact)
    throw new AppError("Can't make a reaction please Sign-in first", 400);
  res.status(201).json({ created: true, message: createReact });
});

export const getLastUserReactActivity = CatchError(async (req, res) => {
  const { id } = req.user;
  const getReacts = await reactPostModel.findAll({
    where: {
      userId: id,
    },
    attributes: {
      exclude: ["deletedAt"],
    },
    include: [
      {
        model: postModel,
        attributes: {
          exclude: ["deletedAt"],
        },
      },
    ],
  });
  if (!getReacts) throw new AppError("No post found", 404);
  res.status(200).json(getReacts);
});

export const deletePostReact = CatchError(async (req, res) => {
  const { id } = req.user;
  const deleteReact = await reactPostModel.destroy({
    where: {
      userId: id,
      postId: req.params.postId,
    },
  });
  if (!deleteReact) throw new AppError("No post found", 404);
  res.status(200).json({ deleted: true, message: deleteReact });
});
