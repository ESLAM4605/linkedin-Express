// models/experience.model.js

import { DataTypes } from "sequelize";
import sequelize from "../../../DB/db.connction.js";
import userModel from "../../user/models/user.model.js";

const experienceModel = sequelize.define("Experience", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.ENUM(
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Apprenticeship",
      "Volunteer",
      "Freelance"
    ),
    allowNull: true,
  },
  CompanyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Define the association with the User model
experienceModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});
userModel.hasMany(experienceModel, { foreignKey: "userId" });
experienceModel.sync();

export default experienceModel;
