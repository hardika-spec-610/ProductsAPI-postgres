import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";
import ReviewsModel from "./model.js";
import ProductsModel from "../products/model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create({
      ...req.body,
      productId: req.params.productId,
    });
    res.status(201).send({ reviewId });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.findAll({
      where: { productId: req.params.productId },
      include: [{ model: UsersModel, attributes: ["firstname", "lastname"] }],
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
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
