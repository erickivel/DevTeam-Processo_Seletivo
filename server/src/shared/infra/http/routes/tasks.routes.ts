import { Router } from "express";

import { controllerAdapter } from "./controllerAdapter";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { CreateTaskController } from "../../../../modules/tasks/controllers/CreateTaskController";
import { ListTasksByUserController } from "../../../../modules/tasks/controllers/ListTasksByUserController";

const tasksRoutes = Router();

const createTaskController = new CreateTaskController()
const listTasksByUserController = new ListTasksByUserController();

tasksRoutes.post("/", ensureAuthenticated, controllerAdapter(createTaskController));
tasksRoutes.get("/", ensureAuthenticated, controllerAdapter(listTasksByUserController));

export { tasksRoutes };