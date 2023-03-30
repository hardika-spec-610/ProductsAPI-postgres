import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoriesModel from "./model.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);

    res.status(201).send({ categoryId });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll({
      // attributes: ["categoryId", "categoryName"],
    });
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

// POST SOME CATEGORIES
categoriesRouter.post("/bulk", async (request, response, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate(request.body);
    response.send(categories.map((c) => c.id));
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
