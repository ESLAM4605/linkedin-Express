import { DataTypes } from "sequelize";
import sequelize from "../../../DB/db.connction.js";
import userModel from "../../user/models/user.model.js";
import postModel from "./posts.model.js";

const commentModel = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);
commentModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});
commentModel.belongsTo(postModel, {
  foreignKey: "postId",
  targetKey: "id",
});

userModel.hasMany(commentModel, {
  foreignKey: "userId",
});
postModel.hasMany(commentModel, {
  foreignKey: "postId",
});

export default commentModel;
