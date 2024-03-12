// models/post.model.js
import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import userModel from "../../user/models/user.model.js";

const postModel = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
postModel.belongsTo(userModel, { foreignKey: "userID", targetKey: "id" });
userModel.hasMany(postModel, { foreignKey: "userID" });

export default postModel;
