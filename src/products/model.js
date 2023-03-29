import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductsModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // <-- This automagically generates a unique string every time we insert a new record
    },
    name: {
      type: DataTypes.TEXT(50), // VARCHAR(50)
      allowNull: false,
    },
    category: {
      //   type: DataTypes.ENUM(
      //     "electronics",
      //     "clothing",
      //     "books",
      //     "beauty",
      //     "home"
      //   ), // VARCHAR(50)
      type: DataTypes.TEXT(50),
      defaultValue: "electronics", // add a default value to match the new ENUM type
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT(255), // VARCHAR(255)
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT(120), // VARCHAR(120)
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }
  //{ timestamps: false }
  // TIMESTAMPS ARE TRUE BY DEFAULT
);

export default ProductsModel;
