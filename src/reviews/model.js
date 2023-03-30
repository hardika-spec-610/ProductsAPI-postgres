import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING(),
  },
});

UsersModel.hasMany(ReviewsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

export default ReviewsModel;
