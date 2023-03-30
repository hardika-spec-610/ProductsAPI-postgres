import Express from "express";
import createHttpError from "http-errors";
import UsersModel from "../users/model.js";
import ReviewsModel from "./model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productId/reviews", async (request, response, next) => {
  try {
    const { id } = await ReviewsModel.create({
      ...request.body,
      productId: request.params.productId,
    });
    response.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews", async (request, response, next) => {
  try {
    const reviews = await ReviewsModel.findAll({
      where: { productId: request.params.productId },
      include: [{ model: UsersModel, attributes: ["name", "surname"] }],
    });
    response.send(reviews);
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
