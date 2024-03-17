// models/language.model.js

import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";
import userModel from "../../user/models/user.model.js";

const languageModel = sequelize.define("Language", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proficiency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the association with the Users table
languageModel.belongsTo(userModel, { foreignKey: "userId", targetKey: "id" });
userModel.hasMany(languageModel, { foreignKey: "userId" });

export default languageModel;
