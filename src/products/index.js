import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "./model.js";
import ProductsCategoriesModel from "./productCategoriesModel.js";
import CategoriesModel from "../categories/model.js";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "../users/model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body);
    // When I create a new blog post, if that has to be associated with one or more categories I'll have to add one or more rows to the junction table (blogsCategories table), containing blogpostId and corresponding categoryId
    if (req.body.categories) {
      // ["de181145-f7d4-4c07-adf4-69dd01911ff0", "aaeb8a80-8a74-4917-a508-afaa3eea6787"] --> MAP --> [{blogId: blogId, categoryId:"de181145-f7d4-4c07-adf4-69dd01911ff0"}, {blogId: blogId, categoryId: "aaeb8a80-8a74-4917-a508-afaa3eea6787"}]
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return { productId: productId, categoryId: category };
        })
      );
    }
    res.status(201).send({ productId });
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:productId/categories", async (req, res, next) => {
  try {
    const { id } = await ProductsCategoriesModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId,
    });
    res.send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    let order = [];
    const { name, description, minPrice, maxPrice, category, sort } = req.query;

    const limit =
      req.query.limit <= 100 && req.query.limit >= 10 ? req.query.limit : 10;
    const offset = req.query.offset ? req.query.offset : 0;
    if (sort) {
      order = [
        [
          sort.charAt(0) === "-" ? sort.substring(1) : sort,
          sort.charAt(0) === "-" ? "DESC" : "ASC",
        ],
      ];
    }
    if (minPrice && maxPrice)
      query.price = { [Op.between]: [minPrice, maxPrice] };
    if (category) query.category = { [Op.iLike]: `${category}%` };
    if (name) query.name = { [Op.iLike]: `${name}%` };
    if (description) query.description = { [Op.iLike]: `%${description}%` };
    if (name && description) {
      delete query.name;
      delete query.description;
      query = {
        ...query,
        [Op.or]: [
          { name: { [Op.iLike]: `%${name}` } },
          { description: { [Op.iLike]: `%${description}` } },
        ],
      };
    }
    const { count, rows: products } = await ProductsModel.findAndCountAll({
      where: { ...query },
      limit,
      offset,
      include: [
        {
          model: CategoriesModel,
          attributes: ["categoryId", "categoryName"],
          through: { attributes: [] },
        },
        {
          model: ReviewsModel,
          include: [
            { model: UsersModel, attributes: ["firstname", "lastname"] },
          ],
          attributes: ["reviewId", "content"],
        },
        // to exclude from the results the junction table rows --> through: { attributes: [] }
      ],
    });
    res.send({
      numberOfPages: Math.ceil(count / limit),
      total: count,
      products,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      include: [
        {
          model: CategoriesModel,
          attributes: ["categoryId", "categoryName"],
          through: { attributes: [] },
        },
        // to exclude from the results the junction table rows --> through: { attributes: [] }
      ],
    });
    // const product = await ProductsModel.findByPk(req.params.id, {
    //   attributes: { exclude: ["createdAt", "updatedAt"] },
    // });
    // attributes could be an array (when you want to pass a list of the selected fields), or an object (with the exclude property, whenever you want to pass a list of omitted fields)
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { productId: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { productId: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
