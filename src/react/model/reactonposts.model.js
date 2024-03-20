import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import reactionModel from "./reactions.model.js";
import userModel from "../../user/models/user.model.js";
import postModel from "../../post/models/posts.model.js";

const reactPostModel = sequelize.define(
  "UserPostReaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
    },
    reactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Reactions",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

userModel.hasMany(reactPostModel, {
  foreignKey: "userId",
});
postModel.hasMany(reactPostModel, {
  foreignKey: "postId",
});
reactionModel.hasMany(reactPostModel, {
  foreignKey: "reactionId",
});

reactPostModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});

reactPostModel.belongsTo(postModel, {
  foreignKey: "postId",
  targetKey: "id",
});

reactPostModel.belongsTo(reactionModel, {
  foreignKey: "reactionId",
  targetKey: "id",
});

export default reactPostModel;
