import { DataTypes } from "sequelize";
import sequelize from "../../../DB/db.connction.js";
import userModel from "../../user/models/user.model.js";

const educationModel = sequelize.define("educations", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  school: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fieldOfStudy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
});
educationModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});
userModel.hasMany(educationModel, { foreignKey: "userId" });
export default educationModel;
