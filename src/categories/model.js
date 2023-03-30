import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const CategoriesModel = sequelize.define("category", {
  categoryId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  categoryName: {
    type: DataTypes.TEXT(50), // VARCHAR(50)
    allowNull: false,
  },
});

export default CategoriesModel;
