import Express from "express";
import UsersModel from "./model.js";

const usersRouter = Express.Router();

usersRouter.post("/", async (request, response, next) => {
  try {
    const { id } = await UsersModel.create(request.body);
    response.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await UsersModel.findAll();
    response.send(users);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
