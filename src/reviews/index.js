import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";
import ReviewsModel from "./model.js";
import ProductsModel from "../products/model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    const { id } = await ReviewsModel.create({
      ...req.body,
      productId: req.params.id,
    });
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll({
      where: { productId: req.params.id },
      include: [{ model: UsersModel, attributes: ["name", "surname"] }],
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findByPk(req.params.reviewId);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(
          404,
          `Review with id ${req.params.reviewId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
