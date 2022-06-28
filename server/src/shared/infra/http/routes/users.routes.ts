import { Router } from "express";

import { CreateUserController } from "../../../../modules/accounts/controllers/CreateUserController";
import { controllerAdapter } from "./controllerAdapter";

const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/", controllerAdapter(createUserController));

export { usersRoutes };