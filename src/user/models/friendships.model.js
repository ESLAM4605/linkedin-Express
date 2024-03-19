import { DataTypes } from "sequelize";
import sequelize from "../../../DB/db.connction.js";
import userModel from "../../user/models/user.model.js";

const friendshipModel = sequelize.define(
  "Friendship",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

friendshipModel.belongsTo(userModel, {
  foreignKey: "user1Id",
  targetKey: "id",
  as: "User1",
});
friendshipModel.belongsTo(userModel, {
  foreignKey: "user2Id",
  targetKey: "id",
  as: "User2",
});
userModel.hasMany(friendshipModel, {
  foreignKey: "user1Id",
  as: "User1Friendships",
});
userModel.hasMany(friendshipModel, {
  foreignKey: "user2Id",
  as: "User2Friendships",
});

export default friendshipModel;
