// models/post.model.js
import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import userModel from "../../user/models/user.model.js";

const imageModel = sequelize.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
imageModel.belongsTo(userModel, { foreignKey: "userId", targetKey: "id" });
userModel.hasMany(imageModel, { foreignKey: "userId" });

export default imageModel;
