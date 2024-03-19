// models/experience.model.js

import { DataTypes } from "sequelize";
import sequelize from "../../../DB/db.connction.js";
import userModel from "../../user/models/user.model.js";
import skillModel from "../../skill/model/skills.model.js";
import experienceModel from "./experiences.model.js";

const UserSkillModel = sequelize.define(
  "user-skills",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

// Define the association with the User model
UserSkillModel.belongsTo(userModel, {
  foreignKey: "userId",
  targetKey: "id",
});

UserSkillModel.belongsTo(experienceModel, {
  foreignKey: "experienceId",
  targetKey: "id",
});

UserSkillModel.belongsTo(skillModel, {
  foreignKey: "skillId",
  targetKey: "id",
});

userModel.hasMany(UserSkillModel, { foreignKey: "userId" });
experienceModel.hasMany(UserSkillModel, { foreignKey: "experienceId" });
skillModel.hasMany(UserSkillModel, { foreignKey: "skillId" });

export default UserSkillModel;
