import sequelize from "../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import userModel from "../user/models/user.model.js";

const messageModel = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

userModel.hasMany(messageModel, {
  foreignKey: "userId",
});

messageModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});

export default messageModel;
