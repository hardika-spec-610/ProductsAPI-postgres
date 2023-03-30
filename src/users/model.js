import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import ReviewsModel from "../reviews/model.js";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  firstname: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});
export default UsersModel;
