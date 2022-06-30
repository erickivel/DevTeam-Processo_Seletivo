import { Router } from "express";

import { controllerAdapter } from "./controllerAdapter";

import { CreateUserController } from "../../../../modules/accounts/controllers/CreateUserController";
import { AuthenticateUserController } from "../../../../modules/accounts/controllers/AuthenticateUserController";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

usersRoutes.post("/", controllerAdapter(createUserController));
usersRoutes.post("/sessions", controllerAdapter(authenticateUserController));

export { usersRoutes };