import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import userModel from "../../user/models/user.model.js";
import postModel from "../../post/models/posts.model.js";

const reactionModel = sequelize.define(
  "Reaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM("like", "love", "care", "cry", "angry"),
      allowNull: false,
      unique: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

userModel.hasMany(reactionModel, {
  foreignKey: "userId",
});

postModel.hasMany(reactionModel, {
  foreignKey: "postId",
});

reactionModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});
reactionModel.belongsTo(postModel, {
  foreignKey: "postId",
  targetKey: "id",
});
export default reactionModel;
