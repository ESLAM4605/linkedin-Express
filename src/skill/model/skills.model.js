import sequelize from "../../../DB/db.connction.js";
import { DataTypes } from "sequelize";

const skillModel = sequelize.define("Skill", {
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
skillModel.sync();
export default skillModel;
